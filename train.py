import numpy as np
import random
import json

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from nltk_utils import assortment_of_words, tokenize, stem
from model import NeuralNet

# Link to intents 
with open('intents.json', 'r') as f:
    intents = json.load(f)

all_words = []
tags = []
xy = []
# loop through every sentence in the intents patterns
for intent in intents['intents']:
    tag = intent['tag']
    # add to tag list
    tags.append(tag)
    for pattern in intent['patterns']:
        # tokenize every word in the sentencein the identified sentence
        w = tokenize(pattern)
        # add to the words list
        all_words.extend(w)
        # add to xy pair
        xy.append((w, tag))

# stemming and word reduction
ignore_words = ['?', '.', '!'] 
all_words = [stem(w) for w in all_words if w not in ignore_words]
# remove all duplicates and sort accordingly
all_words = sorted(set(all_words))
tags = sorted(set(tags))

# print(len(xy), "patterns")
# print(len(tags), "tags:", tags)
# print(len(all_words), "unique stemmed words:", all_words)

# Here we create the training data
D_train1 = []
D_train2 = []
for (pattern_sentence, tag) in xy:
    # D_train1 refers to the assortment_of_words for each pattern_sentence
    assortment = assortment_of_words(pattern_sentence, all_words)
    D_train1.append(assortment)
    # D_train2 refers to PyTorch CrossEntropyLoss, which requires class labels
    label = tags.index(tag)
    D_train2.append(label)

D_train1 = np.array(D_train1)
D_train2 = np.array(D_train2)

# Here we are defining the hyper parameters. 
num_epochs = 1000
batch_size = 8
learning_rate = 0.001
input_size = len(D_train1[0])
hidden_size = 8
output_size = len(tags)
# print(input_size, output_size)

class ChatDataset(Dataset):

    def __init__(self):
        self.n_samples = len(D_train1)
        self.x_data = D_train1
        self.y_data = D_train2

    # Here we begin indexing
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    # Here we are calling the dataset to return the size
    def __len__(self):
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset,
                          batch_size=batch_size,
                          shuffle=True,
                          num_workers=0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = NeuralNet(input_size, hidden_size, output_size).to(device)

# Here we are determining the entropy loss and optimization of parameters
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

# Training the model
loss = None
for epoch in range(num_epochs):
    for (words, labels) in train_loader:
        words = words.to(device)
        labels = labels.to(dtype=torch.long).to(device)
        
        # Forward pass
        outputs = model(words)
        loss = criterion(outputs, labels)
        
        # Backward and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 100 == 0:
        print ('Epoch [{0}/{1}], Loss: {2}'.format(epoch+1, num_epochs, loss.item()))


# print(f'final loss: {loss.item():.4f}')

data = {
"model_state": model.state_dict(),
"input_size": input_size,
"hidden_size": hidden_size,
"output_size": output_size,
"all_words": all_words,
"tags": tags
}

# If training is completed successfully it will be saved to {FILE}
FILE = "data.pth"
torch.save(data, FILE)