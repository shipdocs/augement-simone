---
sidebar_position: 2
---

# Context Engineering

Context Engineering is the practice of designing, managing, and providing the precise information an AI needs to perform a task effectively. It is the foundational discipline upon which the Simone framework is built.

Effective context is not just about providing data; it's about providing the *right* data, in the *right* structure, at the *right* time.

## Core Principles of Context Engineering

Simone is built on several key principles of context engineering:

### 1. Structured Knowledge

Project information is not a monolith. It is meticulously organized into distinct, queryable artifacts:

*   **Manifest:** The high-level project vision and status.
*   **Documentation:** Architectural principles, technical specifications, and guides.
*   **Requirements:** Formal definitions of what to build, organized by milestones.
*   **Sprints & Tasks:** The breakdown of work into executable units.

### 2. Layered Context

The AI is provided with layers of context, from the general to the specific. When executing a task, it has access to:

*   The overarching project architecture.
*   Specific milestone requirements.
*   The current sprint's goals.
*   The detailed task description.

### 3. Just-in-Time Context

Information is provided precisely when needed. By breaking work into discrete tasks, we ensure the context provided is always relevant to the job at hand, minimizing noise and maximizing the signal of the information presented to the model.

### 4. AI-Friendly Format

All project artifacts are stored in simple, machine-readable formats (primarily Markdown and YAML). This design choice makes it effortless for the AI to parse, understand, and reason about the project's state.

## How Simone Implements Context Engineering

Simone provides concrete mechanisms to implement these principles:

*   **The `.simone` Directory:** This acts as the central knowledge base of your project. It's a structured repository of all the context the AI will ever need.

*   **Commands as Context-Loaders:** Simone's commands (e.g., `/project:simone:do_task`) are not just instructions; they are intelligent scripts that gather the relevant context from the `.simone` directory and package it for the AI before it begins work.

*   **Feedback Loop:** As the AI completes work, it updates the project artifacts (e.g., marking tasks as complete, logging activities). This enriches the context for future tasks, creating a virtuous cycle of continuous learning and improved context.

By mastering context engineering, Simone transforms the AI from a simple code generator into a true engineering partner that understands the *why* behind the *what*.