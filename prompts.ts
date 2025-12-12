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

MODEL APPEARANCE:
{{modelSkinToneInstruction}}
{{modelClothingInstruction}}
- Smooth, flawless skin with natural makeup
- Hair pulled back or styled to show earrings clearly

SHOT COMPOSITION:
{{modelShotTypeInstruction}}
- Focus on the earrings while showing human context
- Both earrings should be visible and the focal point

SETTING:
{{modelBackgroundInstruction}}
{{modelLightingInstruction}}

NEGATIVE: No jewelry modifications, no distracting elements, no hair covering earrings.`,

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

BACKGROUND & LIGHTING:
- Background: Pure White (Hex code #FFFFFF). DO NOT ADD A GRADIENT OR VIGNETTE. THE BACKGROUND MUST BE PURE WHITE ACROSS THE ENTIRE IMAGE.
- Lighting: Professional studio lighting. Even, diffused brightness.
- Shadow: {{whiteBgShadowInstruction}}
- Framing: {{whiteBgAngleInstruction}}, {{whiteBgFramingInstruction}}

INSTRUCTIONS:
- Position the earrings naturally as if laid flat or displayed on a stand, but invisible stand processing.
- Ensure the background is uniformly white (255, 255, 255) with no vignette or gray corners.
- High contrast between the jewelry and the white background.

NEGATIVE PROMPT:
gray background, off-white, textured background, studio floor, vignette, dark corners, low quality, blur, distortion, extra jewelry, hallucinated details.`,

  WHITE_BG_GENERAL: `Generate a high-end e-commerce product shot of the provided jewelry piece on a solid white background.

INPUT PRESERVATION:
- The input image is the absolute reference. Preserve the piece EXACTLY.
- Do not add extra chains, links, or charms.
- Keep the exact structure of the original piece.

BACKGROUND & LIGHTING:
- Background: Pure White (Hex code #FFFFFF). DO NOT ADD A GRADIENT OR VIGNETTE. THE BACKGROUND MUST BE PURE WHITE ACROSS THE ENTIRE IMAGE.
- Lighting: Professional studio lighting. Even, bright, and clean.
- Shadow: {{whiteBgShadowInstruction}}
- Framing: {{whiteBgAngleInstruction}}, {{whiteBgFramingInstruction}}

INSTRUCTIONS:
- Isolate the product on the pure white background.
- Ensure there is no gray cast or gradient on the background.
- The goal is a ready-to-use e-commerce image.

NEGATIVE PROMPT:
gray background, off-white, gradient, vignette, textured floor, studio props, blur, noise, distortion, extra chain, extender chain, modifications.`,

  DESCRIPTION_EARRINGS: `You are a professional e-commerce copywriter. Write a clear, factual product description for earrings matching the EXACT structure below.

  <Structure>
  Discover {{name}}, a pair designed for daily wear. It features {{stoneDimensions}} {{stone}} selected for their {{visualCharacteristic}}.

  - **Stone**: {{stoneGrade}}, {{stoneDimensions}}, {{stone}}.
  - **Material**: {{material}}.
  - **Details**: Includes a {{claspType}} and a {{charmDetails}}.
  - **Ideal Wear**: {{idealWear}}.
  </Structure>

  <Instructions>
  - Replace the variables {{variable}} with the provided details.
  - CRITICAL: If a variable (like {{stoneDimensions}}, {{stoneGrade}}, etc.) is empty, unknown, or "undefined", COMPLETELY DISREGARD that part of the sentence. Do NOT invent or hallucinate a value.
  - STRICTLY FORBIDDEN: Do NOT use placeholders like "[Length to be specified]" or "undefined". If data is missing, delete the sentence.
  - STRICTLY FORBIDDEN: Do NOT use the bullet character (•). Use a standard hyphen (-) for the list.
  - FORMATTING: Output the specifications as a properly formatted Markdown list. Each item MUST be on its own new line.
  - Example: If {{stoneDimensions}} is missing, just say "features {{stone}}".
  - Example: If {{charmDetails}} is missing, just say "Includes a {{claspType}}."
  - Keep the structure but adapt slightly for grammar if fields are missing.
  - Do NOT reference chains or necklace lengths for earrings.
  </Instructions>`,

  DESCRIPTION_NECKLACE: `You are a professional e-commerce copywriter. Write a clear, factual product description for a necklace matching the EXACT structure below.
  
  <Structure>
  Discover {{name}}, a piece designed for daily wear. It features {{stoneDimensions}} {{stone}} selected for their {{visualCharacteristic}}. The {{necklaceLengthValue}} inch chain lays flat and moves smoothly.

  - **Stone**: {{stoneGrade}}, {{stoneDimensions}}, {{stone}}.
  - **Chain Material**: {{chainMaterial}}.
  - **Length**: {{necklaceLengthValue}} inches, suitable for most necklines or layering.
  - **Details**: Includes a {{claspType}} and a {{charmDetails}} on the back.
  - **Ideal Wear**: {{idealWear}}.
  </Structure>
  
  <Instructions>
  - Replace the variables {{variable}} with the provided details.
  - CRITICAL: If a variable (like {{stoneDimensions}}, {{chainMaterial}}) is empty, unknown, or "undefined", COMPLETELY DISREGARD that part of the sentence or line. Do NOT invent or hallucinate a value.
  - STRICTLY FORBIDDEN: Do NOT use placeholders like "[Length to be specified]" or "undefined". If data is missing, delete the sentence.
  - STRICTLY FORBIDDEN: Do NOT use the bullet character (•). Use a standard hyphen (-) for the list.
  - FORMATTING: Output the specifications as a properly formatted Markdown list. Each item MUST be on its own new line.
  - Example: If {{chainMaterial}} is missing, remove the "Chain Material" line entirely.
  - Example: If {{necklaceLengthValue}} is missing, remove the sentence "The {{necklaceLengthValue}} inch chain lays flat..." AND remove the "Length:" list item entirely.
  - Example: If {{charmDetails}} is missing, just say "Includes a {{claspType}}."
  - The "Chain Material" line is critical ONLY if the value exists.
  </Instructions>`,

  SOCIAL: `Create a professional, concise social media post (no emojis) using the provided image.

The post should be structured with a body detailing the product's main features. Include a separate list of 4-5 relevant hashtags.

<Example_Post_Instructions>
The post should be written in a similar voice but not exactly like this, be creative, do not add features or anything like a product description, this is a friendly social media post, do not copy the example exactly, use the provided product link to craft the post, the details will not match the example, it is important that you only use the details from the linked page to write a post similar to the example. Do not use em dashes
</Example_Post_instructions>

<Example_Post>
“I designed these to be the perfect pair you reach for every single day. They feature a stunning combination of genuine stones: approximately 6mm round Amethyst beads and a deep, richly colored 6mm square Natural Smoky Quartz. Each stone has a beautiful, polished clarity that catches the light just right. They feel special without being over the top.

[Link]

[Hastags]”

</Example_Post>

The post should be personal, craft a social media post that compliments the image. Present it in a format I can easily copy to paste in my social media app`,
};

export type PromptTemplateKey = keyof typeof DEFAULT_TEMPLATES;
