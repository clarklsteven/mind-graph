---
# Node Schema
## Theory

**Explanation**  
A coherent explanatory model that describes how a system behaves and why.

**Intent Guidance**  
Define what this theory is attempting to explain, and the core proposition about how that system behaves.

**Typical Relationships**
- Domains → Contribute To → Theory
- Theory -> Informed By → Principles
- Theory -> Realised Through → Mechanisms

**Prompts**
- “What is this theory trying to explain?”
- “What does this theory assert about how the system behaves?”
- “What mechanisms does this theory rely on?”
- “What principles underpin this theory?”
- “Where does this theory apply?”

**Common Mistakes**
- Treating a theory as just a collection of ideas rather than a _coherent model_
- Making it too vague to be useful
- Failing to define what the theory actually explains
## Domain

**Explanation**  
A domain is a bounded area of concern within which concepts, mechanisms, and constraints operate.

**Intent Guidance**  
Define the scope within which other elements of the system exist or act. A domain provides context, not behaviour.

**Typical Relationships**

- Mechanism → Applies To → Domain
- Domain → Constrained By → Constraints

**Prompts**

- “What falls inside this domain, and what does not?”
- “What kinds of things operate within this domain?”
- “Where does this domain intersect with others?”
- “What constraints are inherent to this domain?”

**Common Mistakes**

- Treating domains as active (they do not act, they frame action)
- Defining domains too broadly to be useful
- Overlapping domains without clear boundaries
- Misclassifying mechanisms or concepts as domains
## Mechanism

**Explanation**  
A mechanism is a process by which change is produced within the system.

**Intent Guidance**  
Describe what this changes in the system, and how that change occurs.

**Typical Relationships**

- Enabled By → Enablers
- Implemented By → Tools
- Applies To → Domains
- Produces → Outcomes (future)

**Prompts**

- “What change does this mechanism produce?”
- “How does this mechanism actually work?”
- “What enables this to function effectively?”
- “What does this depend on?”
- “What happens if this is absent?”

Optional (useful later):

- “Where does this apply?”

**Common Mistakes**

- Confusing mechanisms with tools
- Naming something without explaining how it works
- Defining something as a mechanism without a clear effect
## Enabler

**Explanation**  
A factor that determines whether and how effectively a mechanism can operate.

**Intent Guidance**  
Describe what affects the effectiveness, reliability, or consistency of mechanisms.

**Typical Relationships**

- Enables → Mechanisms
- Guided By → Principles

**Prompts**

- “What mechanisms depend on this?”
- “What happens when this is weak or missing?”
- “How does this affect the effectiveness of mechanisms?”
- “Is this necessary, sufficient, or supportive?”

**Common Mistakes**

- Treating enablers as mechanisms
- Ignoring them because they are less tangible
- Treating enablers as binary rather than variable in strength
## Constraint

**Explanation**  
A factor that limits, restricts, or distorts the operation of mechanisms within the system.

**Intent Guidance**  
Describe what restricts, limits, or interferes with the effective operation of mechanisms.

**Typical Relationships**

- Constrains → Mechanisms
- Degrades → Outcomes
- Applies To → Domains

**Prompts**

- “What restricts or interferes with mechanisms?”
- “Where do things break down or degrade?”
- “What conditions reduce effectiveness or reliability?”
- “Is this inherent to the domain or introduced externally?”

**Common Mistakes**

- Ignoring constraints until problems appear
- Treating constraints as enablers (or vice versa)
- Treating constraints as fixed when they can be mitigated
## Tool

**Explanation**  
A concrete artefact or implementation used to realise a mechanism in practice.

**Intent Guidance**  
Describe how this is used to realise or execute a mechanism in practice.

**Typical Relationships**

- Implements → Mechanisms
- Applies To → Domains

**Prompts**

- “What mechanism does this implement?”
- “How is this used in practice?”
- “What happens if this is misused or absent?”

**Common Mistakes**

- Confusing tools with mechanisms
- Focusing on tools instead of underlying processes
- Assuming tools create outcomes without understanding the mechanism
## Principle

**Explanation**  
A foundational rule or belief that guides decisions and behaviour within the system.

**Intent Guidance**  
Describe a foundational idea that consistently shapes decisions and behaviour.

**Typical Relationships**

- Shapes → Enablers
- Guides → Mechanisms
- Underpins → Theory

**Prompts**

- “What belief or rule drives decisions in this system?”
- “How does this shape behaviour?”
- “What happens if this principle is violated?”
- “Where is this visible in practice?”

**Common Mistakes**

- Including vague or untestable statements
- Not connecting principles to actual behaviour
- Treating principles as aspirational rather than operational
## Outcome

**Explanation**  
An observable result produced by mechanisms operating within the system.

**Intent Guidance**  
Describe what results from the operation of mechanisms, whether desirable or undesirable.

**Typical Relationships**

- Mechanisms → Produce → Outcomes
- Outcomes → Measured By → Metrics _(future)_

**Prompts**

- “What results from this mechanism?”
- “How would we observe or detect this outcome?”
- “Is this outcome desirable or undesirable?”
- “How would we know this has occurred?”

**Common Mistakes**

- Confusing outcomes with mechanisms
- Not defining outcomes clearly
- Defining activities instead of results
## Problem

**Explanation**  
A known gap in understanding that prevents or limits reasoning about the system.

**Intent Guidance**  
Describe what is unknown, unclear, or needs to be resolved to progress understanding.

**Typical Relationships**

- Blocks → Mechanisms / Outcomes _(optional, light use)_
- Investigated By → Mechanisms / Tools _(future, maybe)_

**Prompts**

- “What don’t we understand here?”
- “What is preventing us from explaining this?”
- “What would we need to know to move forward?”

**Common Mistakes**

- Treating problems as system elements rather than knowledge gaps
- Leaving problems unresolved without revisiting them


---
# Non-System Node Types

## Graph Question
## Graph Action

---
# Relationship Schema

## Untyped

**Explanation**  
A placeholder relationship when meaning hasn’t been defined yet.

**Usage Guidance**
- Use only during exploration
- Replace as soon as possible

**Prompt**
- “What is the actual relationship here?”

**Common Mistakes**
- Leaving these in long-term (they create ambiguity)
## Part Of

**Explanation**  
One node is structurally contained within another.

**Usage Guidance**  
Use only when there is a clear hierarchy.

**Prompt**
- “Is this actually a subset, not just related?”

**Common Mistakes**
- Overusing when a causal relationship is better
## Instance Of

**Explanation**  
A specific example of a broader concept.

**Usage Guidance**
- Use when something is a concrete instance of a category

**Typical Use**
- RAG → Artificial Intelligence
- Ranking → AI

**Prompt**
- “Is this a type/example of that?”

**Common Mistakes**
- Confusing with _Part Of_
## Enables

**Explanation**  
One node allows another to function effectively.

**Usage Guidance**  
- Use when something creates the conditions needed for something else to work.

**Typical Direction**  
Enabler → Mechanism

**Prompt**
- “Does this make the other thing possible or effective?”

**Common Mistakes**
- Using instead of _Implements_ or _Relies On_
## Depends On

**Explanation**  
One node requires another in order to function.

**Usage Guidance**  
- Use when something cannot operate without the other.

**Typical Direction**  
Mechanism → Enabler

**Prompt**
- “Would this fail without that?”

**Common Mistakes**
- Using for weak relationships (“nice to have”)
## Implements

**Explanation**  
A tool realises or executes a mechanism in practice.

**Usage Guidance**  
- Use when something is a concrete way of applying a process.

**Typical Direction**  
Tool → Mechanism

**Prompt**
- “Is this how we actually do that?”

**Common Mistakes**
- Confusing with _Enables_
## Applies To

**Explanation**  
Indicates the context or domain in which something operates or is relevant.

**Usage Guidance**  
- Use to connect action to context.

**Typical Direction**  
Mechanism → Domain

**Prompt**
- “Where does this operate?”

**Common Mistakes**
- Using for causal relationships
## Constrains

**Explanation**  
Limits or restricts the effectiveness or behaviour of another node

**Usage Guidance**  
- Use for negative impacts.

**Typical Direction**  
Constraint → Mechanism

**Prompt**
- “Does this restrict or weaken the other?”

**Common Mistakes**

- Forgetting to model negative effects entirely
## Guides

**Explanation**  
Shapes how another node is designed or behaves, without directly enabling, constraining, or implementing it

**Usage Guidance**  
- Use for softer, less deterministic relationships.

**Typical Direction**  
Principle → Enabler / Mechanism

**Prompt**
- “Does this shape behaviour rather than directly enable it?”

**Common Mistakes**
- Overusing instead of more precise relationships
## Produces

**Explanation**  
A mechanism results in an outcome.

**Usage Guidance**  
Use when modelling cause → result.

**Typical Direction**  
Mechanism → Outcome

**Prompt**
- “What does this create?”

