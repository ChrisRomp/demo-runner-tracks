import pytest
from unittest.mock import patch
from app import app

BASE_URL = 'http://localhost:5173/api/'
SAMPLE_CHECKPOINTS = [
    {"id": 1, "location": 5.2, "description": "Water Station 1"},
    {"id": 2, "location": 10.5, "description": "Water Station 2"}
]

@pytest.fixture
def client():
    """Create a test client for the app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_requests():
    with patch('app.requests') as mock:
        yield mock

def test_list_checkpoints_success(client, mock_requests):
    """Test successful checkpoint listing."""
    # Arrange
    mock_response = mock_requests.get.return_value
    mock_response.json.return_value = SAMPLE_CHECKPOINTS
    
    # Act
    response = client.get('/api/checkpoint/')
    
    # Assert
    assert response.status_code == 200
    assert response.json == SAMPLE_CHECKPOINTS
    mock_requests.get.assert_called_once()

def test_list_checkpoints_error(client, mock_requests):
    """Test checkpoint listing with API error."""
    # Arrange
    mock_requests.get.side_effect = Exception("API Error")
    
    # Act
    response = client.get('/api/checkpoint/')
    
    # Assert
    assert response.status_code == 500
    assert 'error' in response.json
    assert 'API Error' in response.json['error']

def test_send_checkpoint_event_success(client, mock_requests):
    """Test successful checkpoint event creation."""
    # Arrange
    test_data = {
        'checkpointId': 1,
        'bibNumber': 123,
        'eventTime': '2023-10-20T10:00:00Z'
    }
    mock_response = mock_requests.post.return_value
    mock_response.json.return_value = {**test_data, 'id': 1}
    
    # Act
    response = client.post('/api/checkpoint-event/', json=test_data)
    
    # Assert
    assert response.status_code == 201
    assert response.json['checkpointId'] == test_data['checkpointId']
    assert response.json['bibNumber'] == test_data['bibNumber']
    mock_requests.post.assert_called_once()

def test_send_checkpoint_event_missing_fields(client):
    """Test checkpoint event creation with missing required fields."""
    # Arrange
    test_data = {
        'eventTime': '2023-10-20T10:00:00Z'
    }
    
    # Act
    response = client.post('/api/checkpoint-event/', json=test_data)
    
    # Assert
    assert response.status_code == 400
    assert 'error' in response.json
    assert 'required' in response.json['error']

def test_send_checkpoint_event_api_error(client, mock_requests):
    """Test checkpoint event creation when API fails."""
    # Arrange
    test_data = {
        'checkpointId': 1,
        'bibNumber': 123,
        'eventTime': '2023-10-20T10:00:00Z'
    }
    mock_requests.post.side_effect = Exception("API Error")
    
    # Act
    response = client.post('/api/checkpoint-event/', json=test_data)
    
    # Assert
    assert response.status_code == 500
    assert 'error' in response.json
    assert 'API Error' in response.json['error']

def test_send_checkpoint_event_empty_body(client):
    """Test checkpoint event creation with empty request body."""
    # Act
    response = client.post('/api/checkpoint-event/')
    
    # Assert
    assert response.status_code == 400
    assert 'error' in response.json
