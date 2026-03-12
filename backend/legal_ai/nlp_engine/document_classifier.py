from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# sample training data (you can expand later)
train_texts = [

"complaint filed against accused for fraud and cheating",
"legal complaint regarding property dispute",
"agreement between two parties for service contract",
"employment agreement signed between company and employee",
"service contract terms and conditions between client and company",
"petition submitted to court requesting justice",
"petition filed in high court regarding land dispute",
"legal notice sent to tenant for payment delay",
"notice issued for breach of contract"

]

train_labels = [

"Complaint",
"Complaint",
"Agreement",
"Agreement",
"Contract",
"Petition",
"Petition",
"Legal Notice",
"Legal Notice"

]


vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(train_texts)

model = LogisticRegression()

model.fit(X, train_labels)


def classify_document(text):

    X_test = vectorizer.transform([text[:2000]])

    prediction = model.predict(X_test)

    return prediction[0]