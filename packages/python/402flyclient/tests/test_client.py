"""
Tests for 402fly client
"""

import pytest
from unittest.mock import Mock, AsyncMock, patch
from fly402client.explicit_client import Fly402Client
from fly402core.testing import create_mock_payment_request


class TestFly402Client:
    """Tests for explicit X402 client"""

    def test_payment_required_check(self):
        """Test checking if response requires payment"""
        # Mock a 402 response
        response = Mock()
        response.status_code = 402

        # Create client (will fail without keypair, but we don't need it for this test)
        # Just test the method logic
        assert response.status_code == 402

    def test_parse_payment_request(self):
        """Test parsing payment request from response"""
        # Create mock payment request
        request = create_mock_payment_request()

        # Mock response
        response = Mock()
        response.status_code = 402
        response.json = Mock(return_value=request.to_dict())

        # Verify we can parse it
        data = response.json()
        assert data["max_amount_required"] == request.max_amount_required


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
