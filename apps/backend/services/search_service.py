class SemanticSearchService:
    def search(self, query: str, limit: int = 25) -> list[dict]:
        return [{"path": "mock/path", "score": 0.91, "reason": f"semantic match for '{query}'"}][:limit]

semantic_search_service = SemanticSearchService()
