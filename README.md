# Clarity — Semantic Intelligence for Job Matching


### 🚀 Inspiration

Job platforms today rely heavily on keyword matching. This often leads to mismatches where capable candidates are overlooked simply because their resumes don’t use the “right” words, while users struggle to discover roles that truly align with their skills, interests, and long-term goals.

We were inspired to rethink job search as a semantic problem rather than a keyword problem — where people are understood by meaning, not just text. Clarity was built to help users gain clarity over their career paths, not just their next application.


### 💡 What it does

Clarity is an AI-powered career matching platform that goes beyond keywords. Users upload their resume, optional LinkedIn profile, and answer a short questionnaire about their skills, experience, and interests. This information is transformed into a semantic identity vector representing the user in high-dimensional meaning space.

Job postings are processed the same way. Using cosine similarity, Clarity matches users to jobs based on real alignment, not just titles or buzzwords.

Beyond matching, Clarity generates AI-driven personalized career roadmaps that show users what skills to learn, experiences to gain, and steps to take to reach their target roles — helping users not only find jobs, but progress toward the careers they want.

### 🛠️ How we built it

We built Clarity using a semantic matching pipeline:
- Parsed resumes, LinkedIn profiles, and questionnaire responses.
- Extracted skills, experience, and interests using NLP.
- Embedded user and job data into vectors using the same embedding model.
- Combined user features with a weighted fusion scheme (30% skills, 30% experience, 40% interests).
- Stored users and jobs in vector form.
- Computed cosine similarity to rank job recommendations.
- Designed a UI that visualizes matches and surfaces AI-generated career roadmaps.

This architecture allows users and jobs to live in the same semantic space for meaningful comparison.

### 🏆 Accomplishments that we’re proud of
	•	Built a full semantic matching pipeline instead of simple keyword search.
	•	Designed a weighted identity representation for users.
	•	Created job-user comparison in a shared vector space.
	•	Integrated AI-generated career roadmaps, not just job listings.
	•	Turned career discovery into a guided, intelligent experience rather than a static search page.


### How it works

1️⃣ User Data Ingestion

Users provide:
- 📄 Resume
- 🔗 LinkedIn profile (optional)
- 📝 Questionnaire (skills, goals, interests)

These inputs capture a holistic view of the user beyond keywords.


2️⃣ Structured Feature Extraction

From the inputs, the system extracts:
- Skills (technical + soft)
- Experience (roles, projects, industries, seniority)
- Interests & Aspirations (career goals, domains, work style)

This converts unstructured text into meaningful attributes.


3️⃣ Weighted Semantic Embedding

All extracted data is embedded into one identity vector in semantic space using:
- 30% Skills
- 30% Experience
- 40% Interests

UserVector = 0.3(Skills) + 0.3(Experience) + 0.4(Interests)

This vector represents the user’s career identity, not just their resume.

4️⃣ Job Vectorization

Each job posting is processed the same way:
- Requirements
- Responsibilities
- Skills
- Role context

These are embedded into the same semantic space as users, forming Job Vectors.

5️⃣ Semantic Matching (Cosine Similarity)

The system compares:

Similarity(User, Job) = \cos(\theta)
- Higher score → stronger semantic alignment
- Goes beyond titles and keywords
- Captures meaning, intent, and trajectory fit

Jobs are ranked by true relevance, not buzzwords.

6️⃣ AI Reasoning Layer (Gemini-3-Flash-Preview)

Using embedded context, the AI:
- Interprets matches
- Explains why a role fits
- Identifies skill gaps
- Generates custom career roadmaps

This turns matching into guidance.

7️⃣ Output Experience

Users receive:
- Ranked job matches
- Match confidence scores
- Personalized career roadmap
- Skill recommendations to improve alignment
