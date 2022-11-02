root = "src/common/wordLists/"

wordnik = []
with open(f"{root}raw/wordnik.txt", "r") as file:
  for line in file:
    wordnik.append(line.strip())

movies = []
with open(f"{root}raw/movies.txt", "r") as inFile:
  for line in inFile:
    word = line.strip()
    if not word.isalpha():
      continue
    movies.append(word.upper())

common = list(set(movies).intersection(set(wordnik)))

with open(f"{root}processed/movies.txt", "w") as file:
  for word in common:
    file.writelines(f"{word}\n")
