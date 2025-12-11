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

TAG PLACEMENT:
Include a small, tasteful jewelry tag positioned near the piece, and apply the provided logo clearly onto this tag. The tag should be subtly designed (e.g., a small rectangular card, a delicate metal charm) and its presence should enhance, not detract from, the jewelry. If a specific logo image is provided among the inputs, use it as the source texture for this tag.

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

  WHITE_BG_EARRINGS: `E-commerce hero image: the EXACT earrings uploaded, on pure white (#FFFFFF).

CRITICAL JEWELRY PRESERVATION:
- The uploaded jewelry is the PRIMARY REFERENCE. Do NOT modify it in any way.
- Preserve the EXACT proportions, details, and appearance from the input image.
- Gemstones, metal color, and all details MUST match the input exactly.
- Do NOT add extra elements, charms, or decorations not in the original.

BACKGROUND:
- Pure white #FFFFFF from edge to edge
- No gradients, no textures, no floor lines

CAMERA & FRAMING:
{{whiteBgAngleInstruction}}
{{whiteBgFramingInstruction}}

LIGHTING:
- 360° diffused 5700K soft lighting
- Every stone should sparkle, metal should glow
{{whiteBgShadowInstruction}}

OUTPUT:
- High resolution, e-commerce ready
- Suitable for Shopify, Amazon, Etsy

NEGATIVE (avoid these):
No kinks, no extra chains, no length modifications, no added elements, no AI artifacts, no proportional changes, no background color.`,

  WHITE_BG_GENERAL: `STRICT BACKGROUND REPLACEMENT TASK:
Input: A photo of jewelry (and optionally a second close-up photo for details).
Output: The EXACT same jewelry piece, isolated on a pure white (#FFFFFF) background.

CRITICAL INSTRUCTION:
- You are acting as a background remover tool, NOT a creative generator.
- Your ONLY job is to change the background to white.
- PRESERVE the jewelry accurately.
- DO NOT ADD ANY NEW ELEMENTS.
- DO NOT COMPLETE missing parts.
- DO NOT ADD EXTENDER CHAINS.
- If the original chain ends, let it end.
- If the clasp is simple, keep it simple.
- INSPECT THE CLOSE-UP (if provided): Use the second image to confirm details like clasp type, connector rings, and stone setting. The close-up is the TRUTH for those specific details.

JEWELRY PRESERVATION CHECKLIST:
1. Count the chain links in the input. The output MUST match.
2. Check the clasp. If there is no dangling chain in the input, there MUST be none in the output.
3. Check the pendant. Do not transform it.
4. Do NOT add an extra chain layer.
5. Do NOT add a jump ring or extension chain that isn't visible in the source.

BACKGROUND:
- Pure white #FFFFFF from edge to edge
- No gradients, no textures, no floor lines

CAMERA & FRAMING:
{{whiteBgAngleInstruction}}
{{whiteBgFramingInstruction}}

LIGHTING:
- 360° diffused 5700K soft lighting
- Every link visible, every stone sparkling
- Metal glows with professional sheen
{{whiteBgShadowInstruction}}

OUTPUT:
- High resolution, e-commerce ready
- Suitable for Shopify, Amazon, Etsy

NEGATIVE (avoid these):
extra chain, extender chain, extension chain, added links, hallucinated details, drawing, sketch, 3d render, modification, improvement, double chain, clasp chain, loop, dangling chain.`,

  DESCRIPTION_EARRINGS: `You are a professional e-commerce copywriter. Use the uploaded product image to write a clear, factual product description for earrings using the suggested structure and neutral tone below. Replace the bracketed details with the new product information. Do not add flowery, luxurious, or evocative language. Keep sentences direct and informative. You can be somewhat creative with the description. Make sure that it makes sense, revise the format, if needed, so that the product details accurately present the image uploaded. Do not add special text formatting for the dimensions, I should be able to copy/paste without a problem. You can add to the description any information that may assist the customer in understanding the earrings, use the provided image..

Basic Format - use the provided image to add to this:
Discover the [Earring Name], a pair designed for daily wear. It features a [shape] of Genuine [Stone Type], selected for its [visual characteristic]. The earrings hang from [hook/hoop/post] made of [earring material].

• Stone: Polished, [shape] Genuine [Stone Type].
• Earring Material: [earring material] [hook/hoop/post].
• Style: [drop/stud/hoop]
• Details: Includes a [clasp type/backing type] and a [accent detail] on the back.
• Ideal Wear: Built for everyday use

Now generate using these details:

* Earring Name: {{name}}
* Stone Type: {{stone}}
* Shape: {{shape}}
* Visual Characteristic: {{visualCharacteristic}}
* Hook/Hoop/Post: {{hookType}}
* Earring Material: {{material}}`,

  DESCRIPTION_NECKLACE: `You are a professional e-commerce copywriter. Write a clear, factual product description for a necklace using the suggested structure and neutral tone below. Replace the bracketed details with the new product information. Do not add flowery, luxurious, or evocative language. Keep sentences direct and informative. You can be somewhat creative with the description.

**Format:**

Discover the [Necklace Name], a piece designed for daily wear. It features a [shape] of Genuine [Stone Type], selected for its [visual characteristic].

The pendant hangs from a [length]-inch [chain style] made of [chain material]. This construction provides a tarnish-resistant finish. The chain lays flat and moves smoothly.

• **Stone:** Polished, [shape] Genuine [Stone Type].
• **Chain Material:** [chain material] [chain style].
• **Length:** [length] inches, suitable for most necklines or layering.
• **Details:** Includes a [clasp type] and a [accent detail] on the back.
• **Ideal Wear:** Built for everyday use, resists tarnish, and retains shine.

**Now generate using these details:**

- Necklace Name: {{name}}
- Stone Type: {{stone}}
- Shape: {{shape}}
- Visual Characteristic: {{visualCharacteristic}}
- Length: {{necklaceLengthValue}}
- Chain Style: Cable chain
- Chain Material: {{material}}
- Clasp Type: {{claspType}}
- Accent Detail: {{accentDetail}}

Use plain, factual language only. No metaphors, prestige, or poetic phrasing.`,

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
