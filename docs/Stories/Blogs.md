You are a Senior Product Architect and System Designer.

We are building a Blog Module for a Personal Portfolio Website.

The blog will use a Structured Content Block system,
but we will NOT build the editor from scratch.

We will use a professional rich text / block editor library
(such as EditorJS, TipTap, or similar)
that outputs structured JSON content.

Backend: Firebase (Firestore + Auth)
Images: Stored as Base64 (for now)

====================================================

1. # GOAL OF THE BLOG MODULE

- Learn by writing technical articles.
- Publish high-value short tutorials and tips.
- Repurpose content for LinkedIn posts.
- Improve SEO ranking in Google.
- Drive traffic to the portfolio website.

Content Style:

- Short technical tutorials
- Tips & tricks (e.g. Nuxt 4 tips)
- Code examples
- Practical insights
- Clear structure

==================================================== 2) ARCHITECTURE DECISION
====================================================

We will use a Structured Content Block system powered by an editor library.

The editor must:

- Output structured JSON
- Support block-based content
- Allow custom block extensions (code, tips, callouts)
- Be scalable for future features

We will NOT store raw HTML as the source of truth.

==================================================== 3) BLOG POST STRUCTURE
====================================================

Each blog post must contain:

- id
- title
- slug (SEO-friendly, unique)
- excerpt (short description)
- coverImage (Base64)
- content (structured JSON blocks)
- category
- tags (array)
- isPublished (boolean)
- publishDate
- createdAt
- updatedAt
- readingTime (auto-calculated)
- featured (boolean)
- metaTitle
- metaDescription

==================================================== 4) SUPPORTED BLOCK TYPES (INITIAL VERSION)
====================================================

The editor must support:

Core blocks:

- heading
- paragraph
- list
- image
- code
- quote

Enhanced blocks:

- tip
- warning
- note
- divider

Future extensibility:

- table
- embed (YouTube / Twitter)
- interactive component
- comparison block

Each block must include:

- id
- type
- data object (block-specific fields)

==================================================== 5) FRONTEND RENDERING SYSTEM
====================================================

Public website must:

- Render content dynamically based on block type.
- Map each block type to a Vue/Nuxt component.
- Ensure semantic HTML output.
- Support syntax highlighting for code blocks.
- Support automatic Table of Contents generation from headings.

Rendering must be modular and extensible.

==================================================== 6) SEO REQUIREMENTS
====================================================

Each blog post must:

- Have SEO-friendly slug
- Support meta title & description
- Generate OpenGraph tags
- Support structured data (Article schema JSON-LD)
- Be indexable by Google (SSR or SSG required)

URL format:
/blog/{slug}

==================================================== 7) PUBLIC BLOG FEATURES
====================================================

- Blog listing page
- Pagination
- Filter by category
- Filter by tag
- Search by title
- Sort by latest
- Related posts (based on tags/category)

==================================================== 8) FIRESTORE STRUCTURE (PROPOSED)
====================================================

Collection: blogPosts

Each document:

- title
- slug
- excerpt
- content (structured JSON)
- coverImage
- category
- tags
- isPublished
- publishDate
- createdAt
- updatedAt
- readingTime
- metaTitle
- metaDescription
- featured

Consider splitting large content into subcollections if document size approaches Firestore limits.

==================================================== 9) SECURITY REQUIREMENTS
====================================================

- Only authenticated admin can create/edit/delete posts.
- Public users can only read published posts.
- Slug must be unique.
- Prevent overwriting published content accidentally.

==================================================== 10) FUTURE SCALABILITY
====================================================

The system must support:

- Blog analytics
- View count tracking
- Comments system
- Multi-language support
- Content versioning
- Draft vs Published workflow

====================================================
TASK BEFORE IMPLEMENTATION
====================================================

1. Propose the best editor library.
2. Define content JSON schema.
3. Define rendering strategy.
4. Identify Firestore size risks (Base64).
5. Ask clarification questions if needed.
