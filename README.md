\# MemoraDesk – AI Memory Assistant



\*\*An AI-powered personal memory assistant that helps users store, retrieve, and interact with information through natural language conversations.\*\*



\## About the Project



MemoraDesk is an AI-powered memory assistant developed for \*\*Hack With Bangalore 4.0\*\*.



The project aims to make information easier to store, remember, and retrieve using artificial intelligence and persistent memory.



It combines Hindsight Cloud for long-term memory capabilities with Groq for AI-powered responses.



\## Key Features



\- \*\*Long-Term Memory:\*\* Stores information using Hindsight Cloud.

\- \*\*Memory Retrieval:\*\* Retrieves previously stored information.

\- \*\*AI Chat Assistant:\*\* Generates intelligent responses using Groq.

\- \*\*Interactive Dashboard:\*\* Provides a user-friendly interface.

\- \*\*Natural Language Interaction:\*\* Allows users to communicate naturally with the assistant.



\## Technology Stack



| Component      | Technology      |

| -------------- | --------------- |

| Frontend       | React           |

| Backend        | Python          |

| API Framework  | FastAPI         |

| Memory System  | Hindsight Cloud |

| AI Integration | Groq            |



\## Project Structure



```text

MemoraDesk/

├── backend/

│   ├── main.py

│   └── hindsight\_service.py

├── frontend/

│   ├── src/

│   ├── public/

│   └── package.json

├── requirements.txt

└── README.md

```



\## Getting Started



\### 1. Clone the Repository



```bash

git clone https://github.com/solosoul0143/MemoraDesk.git

cd MemoraDesk

```



\### 2. Backend Setup



Create and activate a Python virtual environment:



```bash

python -m venv venv

```



Windows PowerShell:



```powershell

.\\venv\\Scripts\\Activate.ps1

```



Install dependencies:



```bash

pip install -r requirements.txt

```



Configure your environment variables in a root-level `.env` file. Add the required Hindsight Cloud and Groq credentials. \*\*Never commit API keys or secrets to GitHub.\*\*



Start the backend:



```bash

uvicorn backend.main:app --reload

```



Backend URL: `http://127.0.0.1:8000`



\### 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Frontend URL: `http://localhost:5173`



\## Team



\*\*Team Name: Charan M R\*\*



\## Team Members



1\. Charan M R

2\. Santhosh M

3\. Bindhu

4\. Shreya



\## Hackathon



Developed for \*\*Hack With Bangalore 4.0\*\*.



\## Future Enhancements



\- Improved memory management.

\- Enhanced search and retrieval.

\- More personalized AI interactions.

\- Additional integrations and features.



\## License



This project is developed as a hackathon project. Licensing terms can be added when finalized.



