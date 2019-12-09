# sagasu


## Setup

*NOTE*: Required node verions is `>=12.3.0`

```
yarn install 
```

## Usage

`./bin/sagasu --help`

```
Usage: sagasu [options] [command]

Options:
  -h, --help        output usage information

Commands:
  list              List searchable fields
  search [options]  Search for a value with a data type
```


List available fields;

`./bin/sagasu list`

Search for a user by `alias`

`./bin/sagasu search --type user --field alias --query Rose`


## Notes

* Search is performed as strings. i.e numbers & booleans are converted to a string.
* No joining of data is done i.e finding all tickets belonging to a user.
* Instead of processing the JSON files directly I could have also imported the data into 
  a database like SQLite.

*Performance*

* There is a script in `tools/generate-users.js` that will create a new file `tools/large-users.json` that will contain 100K user records.
* This can be used to demonstrate that the solution can handle large json files as json parsing is done via streaming.
  * This avoids trying to parse a large json file into memory, but we still need to iterate over all the data for "search"

### Origins of name

[sagasu](https://jisho.org/word/%E6%8E%A2%E3%81%99) is the Japanese verb "to search".