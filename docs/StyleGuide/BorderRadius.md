# Border Radius

---

## Design Principle

This project uses **consistently rounded corners** throughout — no sharp edges. The standard token is `rounded-2xl` (16px). Only specific UI elements deviate from this.

---

## Radius Tokens

| Token              | Value  | Tailwind       | Usage                                             |
| ------------------ | ------ | -------------- | ------------------------------------------------- |
| None               | 0      | `rounded-none` | Never used                                        |
| Small              | 4px    | `rounded`      | —                                                 |
| Medium             | 6px    | `rounded-md`   | Focus rings, small buttons                        |
| Large              | 8px    | `rounded-lg`   | Buttons, icon badges, nav logo, inputs            |
| XL                 | 12px   | `rounded-xl`   | Inputs, small cards, pills large                  |
| 2XL (**standard**) | 16px   | `rounded-2xl`  | **Cards, section cards, modals, form card**       |
| 3XL                | 24px   | `rounded-3xl`  | Mobile menu bottom corners                        |
| Full               | 9999px | `rounded-full` | Tags, pills, avatars, icon circles, progress bars |

---

## Usage Rules by Component

| Component               | Radius          | Notes                                         |
| ----------------------- | --------------- | --------------------------------------------- |
| `AbCard` project card   | `rounded-2xl`   | Standard                                      |
| Service cards           | `rounded-2xl`   | Standard                                      |
| Skill category cards    | `rounded-2xl`   | Standard                                      |
| Stat cards (AAbout)     | `rounded-2xl`   | Standard                                      |
| Contact info cards      | `rounded-xl`    | Slightly smaller — inline rows                |
| Contact form card       | `rounded-2xl`   | Standard                                      |
| CTA buttons             | `rounded-xl`    | Slightly tighter for buttons                  |
| Form inputs / textarea  | `rounded-xl`    | Matches button                                |
| Tag pills (card footer) | `rounded-full`  | Always full                                   |
| Tech stack chips        | `rounded-full`  | Always full                                   |
| Icon badges             | `rounded-lg`    | Square icon containers                        |
| Icon circles            | `rounded-xl`    | Larger icon containers in service/skill cards |
| Progress bar track      | `rounded-full`  | Always full                                   |
| Progress bar fill       | `rounded-full`  | Always full                                   |
| Avatar rings            | `rounded-full`  | Testimonials                                  |
| Mobile menu             | `rounded-b-3xl` | Only bottom corners                           |
| Toast notification      | `rounded-lg`    | Smaller widget                                |
| Loading spinner         | `rounded-full`  | Circle                                        |

---

## Anti-patterns

- ❌ Never mix `rounded-2xl` and `rounded-3xl` on the same card grid
- ❌ Never use `rounded-sm` — too small for this design language
- ❌ Never apply a radius to a full-bleed section background element
