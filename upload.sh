#!/bin/sh
aws s3 cp --recursive media/onboarding s3://referral-ai/video/onboarding/
aws s3 cp --recursive media/login s3://referral-ai/video/login/
