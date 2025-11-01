"""
402fly Client Package

HTTP client libraries for making 402fly-enabled API calls with automatic payment handling.
"""

__version__ = "0.1.1"

from .explicit_client import Fly402Client
from .implicit_client import Fly402AutoClient

__all__ = [
    "Fly402Client",
    "Fly402AutoClient",
]
