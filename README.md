# sagasu


## Setup

*NOTE*: Required node verions is `>=12.3.0`

```
yarn install 
```

## Usage

`./bin/sagasu.ts --help`

```
Usage: sagasu [options] [command]

Options:
  -h, --help        output usage information

Commands:
  list              List searchable fields
  search [options]  Search for a value within a content type. valid types users | organizations | tickets
```

### Examples

List available fields;

`./bin/sagasu.ts list`

Search for a `user` by `name`

`./bin/sagasu.ts search --contentType user --field name --query Rose`

Search `ticket` by `description` 

`./bin/sagasu.ts search --contentType tickets --field description --query Nostrud`

Search `organizations` by `domain_names`

`./bin/sagasu.ts search -t organizations --field domain_names --query marqet`

Search `organizations` by empty `description`

`./bin/sagasu.ts search -t organizations --field description`

## Notes

* Search is performed as strings. i.e numbers, booleans, array values and dates are converted to a string.
* No joining of data is done i.e finding all tickets belonging to a user.
* Instead of processing the JSON files directly I could have also imported the data into 
  a database like SQLite.
* 

*Performance*

* There is a script in `tools/generate-users.ts` that will create a new file `tools/large-users.json` that will contain 100K user records.
* This can be used to demonstrate that the solution can handle large json files by copying `tools/large-users.json` to `data/users.json`.
* json parsing is done via stream and avoids trying to parse a large json file into memory, but we still need to iterate over all the data for "search"


### Origins of name

[sagasu](https://jisho.org/word/%E6%8E%A2%E3%81%99) is the Japanese verb `to search`.