import random
import json

import torch

from model import NeuralNet
from nltk_utils import assortment_of_words, tokenize

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Will"

def get_response(msg):
    sentence = tokenize(msg)
    X = assortment_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])
    
    return "I do not understand. Please try again."

input__1 = "find mona lisa"
print(input__1, get_response(input__1))

input__2 = "where is the mona lisa"
print(input__2, get_response(input__2))

input__3 = "When was the Louvre built?"
print(input__3, get_response(input__3))

input__4 = "How big is the Louvre?"
print(input__4, get_response(input__4))

input__5 = "Louvre size?"
print(input__5, get_response(input__5))

input__6 = "covid rules"
print(input__6, get_response(input__6))

input__7 = "covid"
print(input__7, get_response(input__7))

