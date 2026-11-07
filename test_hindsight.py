
import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

client = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY"),
)

bank_id = os.getenv("HINDSIGHT_BANK_ID")

try:
    client.retain(
        bank_id=bank_id,
        content="MemoraDesk connection test. Project: Team Sigma."
    )
    print("SUCCESS: Memory stored in Hindsight!")

    result = client.recall(
        bank_id=bank_id,
        query="What is the MemoraDesk connection test about?"
    )
    print("Recall request completed.")
    for memory in result.results:
        print("-", memory.text)

except Exception as e:
    print("Connection test failed:", e)

finally:
    client.close()
