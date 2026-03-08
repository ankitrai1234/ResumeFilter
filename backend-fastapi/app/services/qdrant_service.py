from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import uuid

client = QdrantClient(host="localhost", port=6333)

COLLECTION = "resumes"


def init_collection():

    if not client.collection_exists(COLLECTION):

        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE,
            ),
        )


def store_chunks(chunks):

    points = []

    for chunk in chunks:

        embedding = chunk["embedding"]

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={"text": chunk["text"]},
            )
        )

    client.upsert(
        collection_name=COLLECTION,
        points=points
    )


def search_chunks(query_embedding):

    results = client.query_points(
        collection_name=COLLECTION,
        query=query_embedding,
        limit=5
    )

    return [point.payload["text"] for point in results.points]