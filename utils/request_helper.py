def require_json_body(data):
    """Validate that a request body contains JSON data."""
    if data is None:
        return {"error": "Missing JSON body"}
    return None


def normalize_text(value):
    """Return a stripped string, or None when the value is empty/not a string."""
    if not isinstance(value, str):
        return None
    value = value.strip()
    return value or None
