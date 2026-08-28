---
title: Design Philosophy
description: Design principles for business software interfaces
---

# Stonecrop Design Philosophy

Stonecrop is a framework and component library intended for business software. This document explains the design principles that guide Stonecrop's structure and visual approach. These principles are not prescriptive rules; they are guidelines that explain the *why* and *when to* behind design decisions.

Implementation details like colors, spacing, specific typefaces and component APIs will evolve with contributions as the community and user base grows. These principles should guide that evolution, ensuring that changes harmonize with the underlying philosophy even as surface elements change.

This document is written for designers and developers building with Stonecrop, stakeholders evaluating its approach, and maintainers making decisions about how the system should grow.

## 1. F-Shape Reading and Visual Hierarchy

In 2006, Nielsen Norman Group conducted eye-tracking research across 232 users observing thousands of web pages. The resulting study documented a consistent pattern in how users scan information when reading from left to right. Users first read horizontally across the upper portion of content, then move down slightly and read horizontally again, typically covering a shorter distance than the initial scan. Finally, users scan vertically down the left side of the page. Taken together, these three movements create a shape resembling the letter "F". This pattern has been revalidated in subsequent research and remains remarkably consistent across contexts.

The F-pattern is not a flaw or inefficiency in how users read. Rather, it describes the natural scanning behavior for anyone dealing with information-dense interfaces. In business applications, this scanning mode is the primary reading strategy:

- Users engaging in data entry use find-and-complete workflows to locate specific fields
- Users auditing data scan to identify anomalies or verify values
- In a densely populated table, users scan the top and left of the page to orient their understanding of the cell(s) they are focused on

In all three cases, the F-pattern reflects an efficient, natural behavior that should be supported, not prevented.

**Practical implication**: Critical information should be placed where users' eyes naturally travel. This means placing the most important data, key metrics, and primary actions in the triangle formed by the top-left corner, top-right corner, and bottom-left corner of the interface.

**Exceptions**: Charts and data visualizations require what researchers call the "commitment pattern"—careful, line-by-line reading and comparison of values. When users bring established mental models from real-world experience (postal addresses, phone numbers), honor that familiar structure even if it diverges from F-pattern alignment.

## 2. Tables as Information Default

Microsoft Excel functions as the lingua franca of business problem-solving. This dominance stems from three fundamental advantages:

1. **Near-universal user familiarity** — Most business users already understand basic interactions
2. **Maximum data visibility** — Tables display multiple records simultaneously with sortable columns
3. **No specialized software required** — Excel arrives pre-installed on most business computers

Excel's weakness is the absence of enforced column-level typing. Excel allows arbitrary data in any cell and applies silent type coercion. This creates hidden risks—data silently converts in dangerous ways, often irreversibly.

**The Gene Name Problem**: Beginning in 2004, researchers discovered that approximately one-fifth of published genomics papers contained erroneous gene name conversions. Gene symbols like SEPT2 (*Septin 2*) and MARCH1 (*Membrane-Associated Ring Finger E3 Ubiquitin Protein Ligase*) were automatically converted to dates—'2-Sep' and '1-Mar' respectively. By 2021, 30.9 percent of papers contained gene name errors. The Human Gene Nomenclature Committee eventually renamed 27 genes to avoid Excel's automatic date conversion.

**Stonecrop's approach**: All columns and fields are typed so they can be mapped appropriately to a relational database. Custom types can be used in both UI and database contexts.

**Against tabbed interfaces**: Tabbed interfaces hide content behind labels, forcing users to remember what content exists in each tab. This creates cognitive overhead poorly suited to data-heavy business contexts. Tables should be the default layout strategy for any dataset that is intrinsically relational or benefits from row-by-row comparison.

## 3. Gray-on-Gray as Accessibility and Comfort

High-contrast combinations such as pure black text on white backgrounds or white text on pure black backgrounds cause eyestrain during prolonged viewing:

- **Black on white**: Extreme contrast forces pupils to constrict sharply
- **White on black**: Causes pupils to dilate excessively and creates *halation*—white letters blur into the black background

Research consistently shows that dark gray backgrounds paired with mid-tone or slightly lighter gray text reduce visual fatigue compared to extreme contrast.

### Industrial Standards

The ISA-101 standard, published in 2015 by the International Society of Automation, established design principles for Human-Machine Interfaces (HMI) in process control. These interfaces are specifically designed for operators viewing screens eight or more hours daily. The standard mandates:

- Grayscale as the default visual treatment
- Color reserved strictly for indicating abnormal conditions or alerts

Studies demonstrated that operators viewing gray screens quickly identify abnormal conditions because color carries semantic meaning—every use of color demands attention.

### Implementation Principle

Gray-on-gray should be the visual language default for all primary application surfaces and workflows:

- Accent colors used sparingly and intentionally
- Color primarily for alerts and validation states requiring immediate attention
- When color conveys meaning, always provide accessible fallbacks (icons, labels, visual weight shifts)
- Users should never rely on color alone to understand interface state

## 4. Typography and Border Treatment

A business interface feels professional when it prioritizes clarity and stability over decoration. This impression emerges from two complementary choices:

1. **Minimal ornamentation** — Low or no border-radius on UI elements
2. **Deliberate, neutral typography** — Sans-serif fonts with clean letterforms

Clean letterforms with even character spacing, combined with rectangular button corners and minimal rounding on cards, communicate seriousness and focus on content. The inverse—high border-radius, rounded buttons, script fonts, and playful typefaces—risks feeling casual or lifestyle-oriented, undermining the professional authority that business applications require.

**Sans-serif fonts** have become the standard for professional design because they are consistently associated with modernity and clarity. Humanist sans-serif typefaces, which retain subtle variations in stroke weight, generally offer better legibility than geometric sans-serifs.

**Application**: These principles should apply to component library defaults, primary workflows, and any interface element where user trust matters—settings panels, financial reports, compliance data. Multiple weights of a single font family establish visual hierarchy without introducing unnecessary variety.
