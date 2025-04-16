from flask import Flask, request, render_template, redirect, url_for
import requests
import traceback

RACE_ID = 1 # TODO: make this dynamic in the future
BASE_ENDPOINT = 'http://localhost:5173/api/'

app = Flask(__name__)

## Web routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enter-event')
def enter_event():
    return render_template('enter_event.html')

## APIs
@app.route('/api/checkpoint-event/', methods=['POST'])
def send_checkpoint_event():
    try:
        data = request.get_json(silent=True)
        if data is None:
            return {'error': 'Request body is required'}, 400
        checkpoint_id = data.get('checkpointId')
        bib_number = data.get('bibNumber')
        event_time = data.get('eventTime')

        if not checkpoint_id or not bib_number:
            return {'error': 'checkpoint_id and bib_number are required'}, 400

        response = requests.post(f'{BASE_ENDPOINT}checkpoint-event', json={
            'checkpointId': checkpoint_id,
            'bibNumber': bib_number,
            'eventTime': event_time,
            'raceId': RACE_ID
        })
        checkpoint_event = response.json()
        return checkpoint_event, 201
    
    except Exception as e:
        app.logger.error(f'Error processing checkpoint event: {str(e)}')
        return {'error': str(e)}, 500

@app.route('/api/checkpoint/', methods=['GET'])
def list_checkpoints():
    try:
        # get checkpoints from API
        response = requests.get(f'{BASE_ENDPOINT}checkpoint?raceId={RACE_ID}')
        checkpoints = response.json()
        return checkpoints, 200
    except Exception as e:
        app.logger.error(f'Error listing checkpoints: {str(e)}')
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(port=5100, debug=True) # Port 5100 avoids MacOS issues with port 5000
