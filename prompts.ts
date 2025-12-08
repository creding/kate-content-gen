import { JewelryType, NecklaceLength, ProductDetails } from './types';

export const getNecklaceLengthDescription = (length: NecklaceLength): string => {
  switch (length) {
    case NecklaceLength.COLLAR: return "The necklace should fit tightly around the neck (12-14 inches).";
    case NecklaceLength.CHOKER: return "The necklace should sit at the base of the neck (14-16 inches).";
    case NecklaceLength.PRINCESS: return "The necklace should sit on the collarbone (17-19 inches).";
    case NecklaceLength.MATINEE: return "The necklace should sit between the collarbone and the bust (20-24 inches).";
    case NecklaceLength.OPERA: return "The necklace should hang low, below the bust (28-36 inches).";
    case NecklaceLength.ROPE: return "The necklace should hang very low, near the waist (over 36 inches).";
    default: return "";
  }
};

export const STAGING_PROMPT = (type: JewelryType, props: string[] = []): string => {
  const propsInstruction = props.length > 0 
    ? `Add props such as ${props.join(', ')} that accent the ${type.toLowerCase()}.` 
    : '';

  return `
Generate a high-resolution product image featuring the provided jewelry piece. The lighting should be soft, even, and professional, designed to highlight the intricate details, texture, and brilliance of the materials. Place the jewelry elegantly on a luxurious, minimalist surface such as polished marble, a smooth wooden block, or draped on a soft, complementary fabric.

Include a small, tasteful jewelry tag positioned near the piece, and apply the provided logo clearly onto this tag. The tag itself should be subtly designed (e.g., a small rectangular card, a delicate metal charm) and its presence should enhance, not detract from, the jewelry. If a specific logo image is provided among the inputs, use it as the source texture for this tag.

The background should be clean and simple with a shallow depth of field, ensuring the jewelry remains the sole focal point. Aim for a luxurious, sophisticated, and clean aesthetic that emphasizes craftsmanship and quality, with a timeless and refined mood. Keep the ${type.toLowerCase()} exactly the same. 

${type === JewelryType.EARRINGS ? 'Lay the earrings flat and have the camera lens be from above to give an aerial viewpoint. The camera lens is above, creating an arial viewpoint of the layout.' : 'Do not add any lengths to the piece.'}

${propsInstruction}
`;
};

export const MODEL_PROMPT = (details: ProductDetails): string => {
  const base = details.type === JewelryType.NECKLACE
    ? `Imagine the necklace draped elegantly on a model’s neck, partially visible, perhaps with soft, natural lighting. The focus would still be on the jewelry, but the human element adds context and aspiration. Keep the necklace exactly the same. ${details.necklaceLength ? getNecklaceLengthDescription(details.necklaceLength) : ''}`
    : details.type === JewelryType.EARRINGS
    ? `Imagine the earrings hanging elegantly from a model's earlobes, partially visible, perhaps with soft, natural lighting. The focus would still be on the jewelry, but the human element adds context and aspiration. Keep the earrings exactly the same. Keep the details of the gemstones on the earrings exactly the same. Do not change any detail on the earrings.`
    : `Imagine the ring on an elegant model's hand, fully visible, perhaps with soft, natural lighting. The focus would still be on the jewelry, but the human element adds context and aspiration. Keep the ring exactly the same.`;

  return `${base} Replace the woman in the image with a model that has smooth skin.`;
};

export const WHITE_BG_PROMPT = (type: JewelryType): string => {
  if (type === JewelryType.EARRINGS) {
    return `
E-commerce hero: the EXACT earrings uploaded, centered in a sea of pure white. The background MUST be #FFFFFF

BACKGROUND
- #FFFFFF from corner to corner
- Canvas = 10 000 × 10 000 px of nothing but white
- Necklace occupies only the middle 30 % of the frame
- 35 % empty white above clasp, 35 % below pendant

ZOOM & FRAME
- 35 mm lens, f/8, 8K output (8192 × 8192 px)
- Every link visible, every stone sparkling, zero crop

JEWELRY—PERFECT
- 1:1 copy of your upload
- Chain flows in one liquid S-curve, zero kinks
- Pendant dead-center and level
- NO added links, charms, or clasps, extension chains

LIGHTING—SHADOW-VAPORIZER
- 360° diffused 5700 K softboxes at 4 m
- Fill so strong the necklace casts less than a ghost
- Facets throw starbursts, metal glows like molten glass

OUTPUT
- jpg
- Drag-and-drop ready for Shopify, Amazon, Etsy

HARD NEGATIVE (copy this line):
no shadow, no drop shadow, no floor, no reflection, no kinks, no extra chains, no props, no text, no gradient, no borders, no AI artifacts.

Generate one frame.
    `;
  }
  
  // Default to Necklace/General prompt structure provided
  return `
E-commerce hero: the EXACT necklace uploaded, centered in a sea of pure white. The background MUST be #FFFFFF

BACKGROUND
- #FFFFFF from corner to corner
- Canvas = 10 000 × 10 000 px of nothing but white
- Necklace occupies only the middle 30 % of the frame
- 35 % empty white above clasp, 35 % below pendant

ZOOM & FRAME
- 35 mm lens, f/8, 8K output (8192 × 8192 px)
- Every link visible, every stone sparkling, zero crop

JEWELRY—PERFECT
- 1:1 copy of your upload
- Chain flows in one liquid S-curve, zero kinks
- Pendant dead-center and level
- NO added links, charms, or clasps, extension chains

LIGHTING—SHADOW-VAPORIZER
- 360° diffused 5700 K softboxes at 4 m
- Fill so strong the necklace casts less than a ghost
- Facets throw starbursts, metal glows like molten glass

OUTPUT
- jpg
- Drag-and-drop ready for Shopify, Amazon, Etsy

HARD NEGATIVE (copy this line):
no shadow, no drop shadow, no floor, no reflection, no kinks, no extra chains, no props, no text, no gradient, no borders, no AI artifacts.

Generate one frame.
  `;
};

export const DESCRIPTION_PROMPT = (details: ProductDetails): string => {
  if (details.type === JewelryType.EARRINGS) {
    return `
You are a professional e-commerce copywriter. Use the uploaded product image to write a clear, factual product description for earrings using the suggested structure and neutral tone below. Replace the bracketed details with the new product information. Do not add flowery, luxurious, or evocative language. Keep sentences direct and informative. You can be somewhat creative with the description. Make sure that it makes sense, revise the format, if needed, so that the product details accurately present the image uploaded. Do not add special text formatting for the dimensions, I should be able to copy/paste without a problem. You can add to the description any information that may assist the customer in understanding the earrings, use the provided image..

Basic Format - use the provided image to add to this:
Discover the [Earring Name], a pair designed for daily wear. It features a [shape] of Genuine [Stone Type], selected for its [visual characteristic]. The earrings hang from [hook/hoop/post] made of [earring material].

• Stone: Polished, [shape] Genuine [Stone Type].
• Earring Material: [earring material] [hook/hoop/post].
• Style: [drop/stud/hoop]
• Details: Includes a [clasp type/backing type] and a [accent detail] on the back.
• Ideal Wear: Built for everyday use

Now generate using these details:

* Earring Name: ${details.name}
* Stone Type: ${details.stone}
* Shape: ${details.shape}
* Visual Characteristic: ${details.visualCharacteristic}
* Hook/Hoop/Post: ${details.hookType || 'Standard'}
* Earring Material: ${details.material}
    `;
  }

  // Necklace / General
  return `
You are a professional e-commerce copywriter. Write a clear, factual product description for a necklace using the suggested structure and neutral tone below. Replace the bracketed details with the new product information. Do not add flowery, luxurious, or evocative language. Keep sentences direct and informative. You can be somewhat creative with the description.

**Format:**

Discover the [Necklace Name], a piece designed for daily wear. It features a [shape] of Genuine [Stone Type], selected for its [visual characteristic].

The pendant hangs from a [length]-inch [chain style] made of [chain material]. This construction provides a tarnish-resistant finish. The chain lays flat and moves smoothly.

• **Stone:** Polished, [shape] Genuine [Stone Type].
• **Chain Material:** [chain material] [chain style].
• **Length:** [length] inches, suitable for most necklines or layering.
• **Details:** Includes a [clasp type] and a [accent detail] on the back.
• **Ideal Wear:** Built for everyday use, resists tarnish, and retains shine.

**Now generate using these details:**

- Necklace Name: ${details.name}
- Stone Type: ${details.stone}
- Shape: ${details.shape}
- Visual Characteristic: ${details.visualCharacteristic}
- Length: ${details.necklaceLengthValue || 'Adjustable'}
- Chain Style: Cable chain
- Chain Material: ${details.material}
- Clasp Type: ${details.claspType || 'Lobster'}
- Accent Detail: ${details.accentDetail || 'Signature Tag'}

Use plain, factual language only. No metaphors, prestige, or poetic phrasing.
  `;
};

export const SOCIAL_PROMPT = `
Create a professional, concise social media post (no emojis) using the provided image.

The post should be structured with a body detailing the product's main features. Include a separate list of 4-5 relevant hashtags.

<Example_Post_Instructions>
The post should be written in a similar voice but not exactly like this, be creative, do not add features or anything like a product description, this is a friendly social media post, do not copy the example exactly, use the provided product link to craft the post, the details will not match the example, it is important that you only use the details from the linked page to write a post similar to the example. Do not use em dashes
</Example_Post_instructions>

<Example_Post>
“I designed these to be the perfect pair you reach for every single day. They feature a stunning combination of genuine stones: approximately 6mm round Amethyst beads and a deep, richly colored 6mm square Natural Smoky Quartz. Each stone has a beautiful, polished clarity that catches the light just right. They feel special without being over the top.

[Link]

[Hastags]”

</Example_Post>

The post should be personal, craft a social media post that compliments the image. Present it in a format I can easily copy to paste in my social media app
`;