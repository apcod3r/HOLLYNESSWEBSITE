#!/bin/bash
cd /home/apcoder/HOLLYNESSWEBSITE/hollyness-api
venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
