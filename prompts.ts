export const DEFAULT_TEMPLATES = {
  STAGING: `Generate a high-resolution product image featuring the provided jewelry piece.

CRITICAL JEWELRY PRESERVATION:
- The uploaded jewelry is the PRIMARY REFERENCE. Do NOT modify it in any way.
- Preserve the EXACT chain length, link count, and proportions from the input image.
- Do NOT extend, shorten, add links, or change pendant position.
- Keep the EXACT curvature, drape, and layout as shown in the reference.
- Gemstones, metal color, and all details MUST match the input exactly.
- Do NOT add extra chains, charms, extensions, or elements not in the original.

{{lightingInstruction}}

SURFACE & PLACEMENT:
Place the jewelry {{layoutInstruction}} on {{surfaceInstruction}}.

CARD PLACEMENT:
- Include one small, tasteful jewelry card positioned near the piece, using the provided logo. 
- Do not include any additional text or information on the card. 
- Do not attach the card to the jewelry. 
- Do not cover the jewelry with the card.

BACKGROUND & COMPOSITION:
The background should be clean and simple with a shallow depth of field, ensuring the jewelry remains the sole focal point. Aim for a luxurious, sophisticated, and clean aesthetic that emphasizes craftsmanship and quality.

{{typeSpecificInstruction}}

{{propsInstruction}}

NEGATIVE (avoid these):
No kinks, no extra chains, no length modifications, no added charms, no AI artifacts, no proportional changes.`,

  MODEL_NECKLACE: `Generate a beautiful model shot featuring the provided necklace.

CRITICAL JEWELRY PRESERVATION:
- The necklace is the PRIMARY REFERENCE. Keep it EXACTLY the same.
- Do NOT modify chain length, pendant, or any details.
- Do NOT add extender chains or extensions.

MODEL APPEARANCE:
{{modelSkinToneInstruction}}
{{modelClothingInstruction}}
- Smooth, flawless skin with natural makeup
- Hair styled elegantly, not covering the jewelry

SHOT COMPOSITION:
{{modelShotTypeInstruction}}
- Focus on the jewelry while showing human context
- The necklace should be the focal point

SETTING:
{{modelBackgroundInstruction}}
{{modelLightingInstruction}}

{{lengthDescription}}

NEGATIVE: No extender chains, no jewelry modifications, no distracting elements.`,

  MODEL_EARRINGS: `Generate a beautiful model shot featuring the provided earrings.
  
  CRITICAL JEWELRY PRESERVATION:
  - The earrings are the PRIMARY REFERENCE. Keep them EXACTLY the same.
  - Keep all gemstone details, metal color, and design exactly as shown.
  - Do NOT modify any aspect of the earrings.
  - {{typeSpecificInstruction}}
  
  MODEL APPEARANCE:
  {{modelSkinToneInstruction}}
  - The model is SECONDARY. Used only for context and scale.
  - Hair pulled back completely to show earrings clearly.
  - Model's face/features should be soft or partially cropped to focus on the ear/jawline area.
  
  SHOT COMPOSITION:
  - **EXTREME CLOSE-UP**: The earrings must be the absolute focal point.
  - **MACRO LENS STYLE**: Sharp focus ONLY on the earrings. Shallow depth of field (bokeh) for the model.
  - The earrings should occupy a significant portion of the frame.
  - Do NOT generate a full portrait. Focus on the ear and neck area only.
  
  SETTING:
  {{modelBackgroundInstruction}}
  {{modelLightingInstruction}}
  
  NEGATIVE: No jewelry modifications, no distracting elements, no hair covering earrings, no full face portraits.`,

  MODEL_RING: `Generate a beautiful model shot featuring the provided ring.

CRITICAL JEWELRY PRESERVATION:
- The ring is the PRIMARY REFERENCE. Keep it EXACTLY the same.
- Keep all gemstone details, metal color, and design exactly as shown.
- Do NOT modify any aspect of the ring.

MODEL APPEARANCE:
{{modelSkinToneInstruction}}
- Elegant, well-manicured hands
- Natural nail color or subtle polish

SHOT COMPOSITION:
{{modelShotTypeInstruction}}
- Focus on the ring while showing human context
- The ring should be the focal point

SETTING:
{{modelBackgroundInstruction}}
{{modelLightingInstruction}}

NEGATIVE: No jewelry modifications, no distracting elements.`,

  WHITE_BG_EARRINGS: `Generate a high-end e-commerce product shot of the provided earrings on a solid white background.

INPUT PRESERVATION:
- The input image is the absolute reference. Preserve the earrings EXACTLY as they appear.
- Do not modify stones, metal, or shape.
- {{typeSpecificInstruction}}

BACKGROUND & LIGHTING:
- Background: Pure White (Hex code #FFFFFF). DO NOT ADD A GRADIENT OR VIGNETTE. THE BACKGROUND MUST BE PURE WHITE ACROSS THE ENTIRE IMAGE.
- Lighting: Professional studio lighting. Even, diffused brightness.
- Shadow: {{whiteBgShadowInstruction}}
- Framing: {{whiteBgAngleInstruction}}, {{whiteBgFramingInstruction}}

INSTRUCTIONS:
- CRITICAL FRAMING: Portrait orientation (3:4 aspect ratio). Ensure exactly 30% whitespace padding around the jewelry piece on all sides. Zoom out slightly to ensure the entire item is visible with generous breathing room. DO NOT CROP.
- Position the earrings according to the specified framing angle.
- Ensure the background is uniformly white (255, 255, 255) with no vignette or gray corners.
- High contrast between the jewelry and the white background.

NEGATIVE PROMPT:
gray background, off-white, textured background, studio floor, vignette, dark corners, low quality, blur, distortion, extra jewelry, hallucinated details.`,

  WHITE_BG_GENERAL: `Generate a high-end e-commerce product shot of the provided jewelry piece on a solid white background.

INPUT PRESERVATION:
- The input image is the absolute reference. Preserve the piece EXACTLY.
- CRITICAL: Preserve all original details including charms, pendants, extender chains, and signature logo tags.
- CLASP DETAILS: Ensure the clasp area is rendered EXACTLY as in the original image. Do not remove or smooth out the signature tag, logo charm, or extender chain at the clasp.
- Do not add fake or hallucinated details, but strictly keep what is present in the input.

BACKGROUND & LIGHTING:
- Background: Pure White (Hex code #FFFFFF). DO NOT ADD A GRADIENT OR VIGNETTE. THE BACKGROUND MUST BE PURE WHITE ACROSS THE ENTIRE IMAGE.
- Lighting: Professional studio lighting. Even, bright, and clean.
- Shadow: {{whiteBgShadowInstruction}}
- Framing: {{whiteBgAngleInstruction}}, {{whiteBgFramingInstruction}}

INSTRUCTIONS:
- CRITICAL FRAMING: Portrait orientation (3:4 aspect ratio). Ensure exactly 30% whitespace padding around the jewelry piece on all sides. Zoom out slightly to ensure the entire item is visible with generous breathing room. DO NOT CROP.
- Isolate the product on the pure white background.
- Ensure there is no gray cast or gradient on the background.
- The goal is a ready-to-use e-commerce image.

NEGATIVE PROMPT:
gray background, off-white, gradient, vignette, textured floor, studio props, blur, noise, distortion, modifications, changes to design, removing signature tags, removing clasp details, missing chain.`,

  DESCRIPTION_EARRINGS: `You are a professional jewelry copywriter with an eye for detail. Write a sophisticated, natural product description.
  
  <Goal>
  Create a description that sounds human-written and follows the user's details EXACTLY. 
  - phrasing should be fluid (e.g. "features 5mm Citrine studs" is better than "features stone dimensions 5mm stone Citrine").
  - Do NOT be "robotic".
  - Do NOT hallucinate values.
  </Goal>

  <Template>
  Discover {{name}}, a pair designed for daily wear. It features {{stoneDimensions}} {{stone}} selected for their {{visualCharacteristic}}.

  - **Stone**: {{gemstoneSummary}} OR {{stoneDimensions}} {{stone}}.
  - **Material**: {{material}}.
  - **Design**: {{earringLength}}.
  - **Details**: {{claspType}} / {{charmDetails}}.
  - **Ideal Wear**: {{idealWear}}.
  </Template>

  <Instructions>
  1. Use the <Template> as a guide for structure, but ensure the sentences flow naturally.
  2. **Crucial Rule on Stones**:
     - *Priority*: If {{gemstoneSummary}} is provided (e.g. "Gemstones featured: ..."), USE IT as the description for the Stone bullet point.
     - *Fallback*: If no summary, use "{{stoneDimensions}} {{stone}}".
  3. **Crucial Rule on Material**:
     - Use the EXACT material name provided (e.g. "14k Gold Filled").
  4. Cleanup:
     - Remove empty variables nicely.
     - If {{charmDetails}} is empty, just say "Finished with a {{claspType}}" or remove the Details line if both are empty.
     - Fix punctuation (no double commas).
  5. Return ONLY the final formatted text.
  </Instructions>`,

  DESCRIPTION_NECKLACE: `You are a professional jewelry copywriter with an eye for detail. Write a sophisticated, natural product description.
  
  <Goal>
  Create a description that sounds human-written and follows the user's details EXACTLY. 
  - phrasing should be fluid (e.g. "hangs from an 18-inch 14k Gold Filled Paperclip chain" is better than "chain crafted from 14k Gold Filled").
  - Do NOT be "robotic".
  - Do NOT hallucinate values.
  </Goal>

  <Template>
  Discover {{name}}, a piece designed for daily wear. It features {{stoneDimensions}} {{stone}} selected for their {{visualCharacteristic}}. The pendant hangs from a {{necklaceLengthValue}}-inch {{chainMaterial}} {{chainStyle}} chain.

  - **Stone**: {{stoneGrade}}, {{stoneDimensions}}, {{stone}}.
  - **Chain Material**: {{chainMaterial}}.
  - **Chain Style**: {{chainStyle}}.
  - **Length**: {{necklaceLengthValue}} inches, suitable for most necklines or layering.
  - **Clasp**: {{claspType}}.
  - **Details**: Features {{charmDetails}} on the back.
  - **Ideal Wear**: {{idealWear}}.
  </Template>
  
  <Instructions>
  1. Use the <Template> as a guide for structure, but ensure the sentences flow naturally.
  2. **Crucial Rule on Chain Style**: 
     - If {{chainStyle}} is provided (e.g. "Paperclip"), use it naturally: "14k Gold Filled Paperclip chain".
     - If {{chainStyle}} is MISSING, do NOT invent one. Just say "14k Gold Filled chain". NEVER guess "cable".
  3. **Crucial Rule on Material**:
     - Use the EXACT material name provided (e.g. "14k Gold Filled").
  4. Cleanup:
     - Remove empty variables nicely.
     - If {{claspType}} is missing, remove the "Clasp" line.
     - If {{charmDetails}} is missing, remove the "Details" line completely.
     - Fix punctuation (no double commas).
  5. Return ONLY the final formatted text.
  </Instructions>`,

  SOCIAL: `Create a professional, concise social media post (no emojis) using the provided image.
  
  <Product_Details>
  - Name: {{name}}
  - Type: {{type}}
  - Stone: {{stone}} ({{stoneDimensions}})
  - Material: {{material}} / {{chainMaterial}}
  - Style: {{chainStyle}}
  - Wear: {{idealWear}}
  </Product_Details>

  The post should be structured with a body detailing the product's main features. Include a separate list of 4-5 relevant hashtags.
  
  <Example_Post_Instructions>
  The post should be written in a similar voice but not exactly like this, be creative, do not add features or anything like a product description, this is a friendly social media post, do not copy the example exactly, use the provided product details to craft the post. Do not use em dashes.
  </Example_Post_instructions>
  
  <Example_Post>
  “I designed these to be the perfect pair you reach for every single day. They feature a stunning combination of genuine stones: approximately 6mm round Amethyst beads and a deep, richly colored 6mm square Natural Smoky Quartz. Each stone has a beautiful, polished clarity that catches the light just right. They feel special without being over the top.
  
  Link in first comment below.
  
  [Hastags]”
  
  </Example_Post>
  
  The post should be personal, craft a social media post that compliments the image and the product details. Present it in a format I can easily copy to paste in my social media app`,
};

export type PromptTemplateKey = keyof typeof DEFAULT_TEMPLATES;
