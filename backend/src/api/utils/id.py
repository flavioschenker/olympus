import ulid

def generate_public_id(prefix: str) -> str:
    """
    Generates a new, lexicographically sortable user ID in the format 'prefix_(ULID)'.
    """
    uid = ulid.new()
    uid = uid.str[:16]
    return f"{prefix}_{uid}"