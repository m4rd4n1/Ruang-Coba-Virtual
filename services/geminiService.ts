import { GoogleGenAI, Modality } from "@google/genai";

const VTON_PROMPT = `You are a Virtual Try-On engine.

Inputs:

Image 1: person/model photo.
Image 2: a single clothing item (top or bottom) on a clean background.
Task:

Output a realistic photo where the person in Image 1 wears the garment from Image 2.
Preserve the original face, hair, pose, body proportions, lighting, and background from Image 1.
Fit the garment naturally with correct drape, folds, and shadows; align shoulders/waist/hips/knees.
If the product is a top, replace only the top; if a bottom, replace only the bottom; if a full set, replace both.
Match color, pattern, and details (buttons, zippers, pockets, stitching) exactly from Image 2.
Crucially, preserve the original silhouette, cut, and design of the garment from Image 2. Do not add, remove, or significantly alter design elements like collars, sleeve length, or hemlines.
Handle occlusions (crossed arms, hair, accessories) with proper layering; don’t alter the face.
Avoid distortions, body-through-cloth, artifacts, wrong patterns/colors, or watermarks.
Output:

Realistic portrait image, original background preserved, around 1024×1536 px, no watermark.`;

const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:mime/type;base64,..."
      const [header, data] = result.split(',');
      if (!data) {
          reject(new Error("Tidak dapat membaca data file."));
          return
      }
      const mimeType = header.split(':')[1].split(';')[0];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateTryOnImage = async (modelFile: File, clothingFile: File): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("Variabel lingkungan API_KEY tidak diatur.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const modelImagePart = await fileToBase64(modelFile);
    const clothingImagePart = await fileToBase64(clothingFile);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { text: VTON_PROMPT },
                { text: "\n--- Input Image 1 (person/model) ---" },
                { inlineData: modelImagePart },
                { text: "\n--- Input Image 2 (clothing item) ---" },
                { inlineData: clothingImagePart },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("Tidak ada gambar yang dihasilkan. Model mungkin menolak permintaan tersebut. Silakan periksa gambar input Anda dan coba lagi.");
};