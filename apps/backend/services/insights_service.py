class InsightsService:
    def summarize(self) -> dict:
        return {
            "duplicate_waste_bytes": 0,
            "screenshot_count": 0,
            "large_unused_count": 0,
        }

insights_service = InsightsService()
