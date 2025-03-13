from langchain_core.documents import Document
from langchain_core.vectorstores import VectorStore


def similarity_search_with_score(vector_store: VectorStore, query: str):
    try:
        docs, scores = zip(
            *vector_store.similarity_search_with_score(
                query,
                k=5
            )
        )
    except Exception as e:
        print('Exception:', e)
        return []
    result = []
    doc: Document
    for doc, np_score in zip(docs, scores):
        score = float(np_score)  # np_score: numpy-float
        doc.metadata['score'] = score
        result.append(doc)

    return result
