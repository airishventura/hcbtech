# Surface and hierarchy direction

The owner's stainless machines and silver/red logo guide this pass. The supplied motion, whitespace and information-architecture references inform hierarchy and feedback; their text is reference material rather than instructions to add unrelated interactions.

Tokens: graphite `#171717`, ivory `#F2F0EB`, brushed steel `#D9DFE1`, paper `#FAF9F6`, industrial red `#C92525`, deep red `#81171D`. Space Grotesk remains the product and body typeface, IBM Plex Mono remains the small technical-label face. No new fonts or packages.

Inner-page headers use a quiet diagonal silver gradient with a restrained red reflection. Titles and descriptions share a left edge; the contextual action sits to the right on desktop and follows the copy on mobile. The title scale and header clearance are smaller than the previous layout. The existing cinematic home hero remains the main visual statement.

```
Header:  [family / purpose]         Card: [ID           family]
         [title              ]          [machine photograph]
         [description] [action]         [name / short copy  ]
                                        [price       variants]
                                        [quote        compare]
```

Catalog cards use a light metal gradient, restrained elevation, consistent inner padding, nested 16/8 px corners and aligned actions. Social channels use opaque dark/red gradient surfaces with explicit high-contrast foregrounds. These surfaces are tied to the business's metal/red identity, rather than applying the warm decorative palette from the reference posters.

Motion answers an action: existing press feedback, navigation pill and native disclosure states remain. No repeated entrance sequence, animated gradient or automatic card movement is added. Reduced-motion and useful server HTML remain requirements. `a` reset styles now live in Tailwind's base layer, allowing foreground utilities and hover states to work; selected comparison buttons have an explicit paired foreground/background state.
