import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder

print("== LabelEncoder ==")
encoder = LabelEncoder()
colors = ["Red", "Blue", "Green", "Red"]
encoded_colors = encoder.fit_transform(colors)
print(encoded_colors, encoder.classes_)
print(encoder.inverse_transform([0, 1, 2]))
spam = LabelEncoder().fit(["Spam","Not Spam","Spam","Not Spam"])
print(spam.classes_, spam.transform(["Spam","Not Spam"]))

print("== OneHotEncoder full ==")
X = [["Red"], ["Blue"], ["Green"], ["Red"]]
enc = OneHotEncoder(sparse_output=False)
out = enc.fit_transform(X)
print(enc.categories_, enc.get_feature_names_out(["color"]))
print(out)

print("== OneHot sparse + ignore ==")
enc2 = OneHotEncoder(handle_unknown="ignore", sparse_output=True)
enc2.fit(X)
r = enc2.transform([["Yellow"], ["Red"]])
print(type(r).__name__, r.toarray())
print(enc2.categories_)

print("== unknown without ignore ==")
try:
    OneHotEncoder(sparse_output=False).fit(X).transform([["Yellow"]])
except Exception as e:
    print(type(e).__name__, str(e)[:120])

print("== drop first yes/no ==")
Y = [["Yes"], ["No"], ["Yes"], ["No"]]
e3 = OneHotEncoder(sparse_output=False).fit(Y)
print(e3.categories_, e3.transform([["Yes"],["No"]]))
e4 = OneHotEncoder(drop="first", sparse_output=False).fit(Y)
print(e4.get_feature_names_out(["answer"]), e4.transform([["Yes"],["No"]]))

print("== OrdinalEncoder ==")
data = [["Low"], ["High"], ["Medium"], ["Low"]]
oe = OrdinalEncoder(categories=[["Low", "Medium", "High"]])
print(oe.fit_transform(data).T, oe.categories_)
print(sorted(["Low","Medium","High"]))
oe2 = OrdinalEncoder().fit(data); print(oe2.categories_)
