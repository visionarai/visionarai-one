---
mode: "agent"
description: "Generate a PRD base on the project and the given requirements."
---

# Generate a PRD base on the project and the given requirements.

- Ask the users about the requirements of the PRD if not already provided.

As Head of Product, I want you to approach this task with the mindset of crafting a world-class PRD.
Your expertise will be critical in helping structure and refine the document.
I'll provide a template as a Project Overview, Additional Context if needed, and the Output Format.
Your role is to guide me in articulating a clear, actionable, and strategic PRD that aligns with our company's vision.
Please generate a comprehensive Project Requirements Document (PRD) based on the following project summary and requirements:

-> Instructions

1. Generate comprehensive requirements based on the project summary
2. Ensure each requirement is atomic (describes one thing)
3. Use clear, unambiguous language
4. Make requirements testable and measurable where possible
5. Maintain consistent ID formatting and sequential numbering
6. Do not overdo it, use as few words as possible

-> Output Format:

Product Requirements Document: [Project Name]
[Description]

### Functional Requirements

| Requirement ID | Description | User Story | Expected Behavior/Outcome |
| -------------- | ----------- | ---------- | ------------------------- |

Generate requirements in the above table format with the following specifications:

- Use REQ-FN-### format for IDs, starting from 001
- Each requirement should be clear, specific, and testable
- Include user stories in the format "As a [role], I want [feature] so that [benefit]"
- Describe concrete, measurable outcomes or behaviors

DO NOT add anything else to it.
