/**
 * Shared example data. Every scikit-learn output below was produced by running the
 * matching snippet with scikit-learn 1.8.0 (see README → "Verified outputs").
 */
export const STUDENTS = [
  ['Student A', 'Red'],
  ['Student B', 'Blue'],
  ['Student C', 'Green'],
  ['Student D', 'Red'],
];

export const COLORS = ['Red', 'Blue', 'Green', 'Red'];

/** Illustrative mapping used for teaching (NOT what scikit-learn would assign). */
export const ILLUSTRATIVE_CODES: Record<string, number> = {Red: 0, Blue: 1, Green: 2};

/** What sklearn.preprocessing.LabelEncoder really learns: classes_ sorted alphabetically. */
export const SKLEARN_LABEL_CLASSES = ['Blue', 'Green', 'Red'];
export const SKLEARN_LABEL_CODES: Record<string, number> = {Blue: 0, Green: 1, Red: 2};
export const SKLEARN_LABEL_OUTPUT = '[2 0 1 2]'; // fit_transform(["Red","Blue","Green","Red"])
export const SKLEARN_LABEL_CLASSES_PRINT = "['Blue' 'Green' 'Red']";

/** One-hot (display order Red, Blue, Green, as in the teaching table). */
export const ONE_HOT: Record<string, number[]> = {
  Red: [1, 0, 0],
  Blue: [0, 1, 0],
  Green: [0, 0, 1],
};

/** OneHotEncoder(sparse_output=False).fit_transform on [["Red"],["Blue"],["Green"],["Red"]] */
export const SKLEARN_OHE_FEATURES = "['color_Blue' 'color_Green' 'color_Red']";
export const SKLEARN_OHE_ROWS = ['[0. 0. 1.]', '[1. 0. 0.]', '[0. 1. 0.]', '[0. 0. 1.]'];

export const ORDINAL_ORDER = ['Low', 'Medium', 'High'];
export const ORDINAL_ALPHABETICAL = ['High', 'Low', 'Medium'];

/** Shared comparison dataset (Video 4). All three encoders applied to the same Size column. */
export const SIZE_VALUES = ['Small', 'Medium', 'Large', 'Small'];
export const SIZE_LABEL_CODES = [2, 1, 0, 2]; // LabelEncoder: classes_ = ['Large','Medium','Small']
export const SIZE_ORDINAL_CODES = [0, 1, 2, 0]; // OrdinalEncoder(categories=[['Small','Medium','Large']])
export const SIZE_OHE_COLUMNS = ['Large', 'Medium', 'Small']; // OneHotEncoder feature order (alphabetical)
export const SIZE_OHE_ROWS = [
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 0],
  [0, 0, 1],
];
