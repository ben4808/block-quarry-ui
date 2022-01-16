# Block Quarry

**Link to app**: http://blockquarry.net

Block Quarry is a free crowd-sourced word list augmentation tool for crossword constructors. It helps you add extra entries to your word list, targeted to the specific slot(s) you are trying to fill right now.

## Quick Start

1. Enter the pattern you are trying to fill into the search bar, using `.` to indicate open squares. Hit Enter. The left panel will populate with all the matching entries in the database.
<image>
1. Click the Export button, and a new tab will be populated with these entries in .dict format. Copy/paste this onto the top of your current .dict file and reload your construction software.
<image>
1. Find more lively fill for your grid!

## Discovering Brand New Entries

There exist multitudes of fresh and lively entries, espcially long ones, that have never appeared in a published crossword or even a constructor's word list. This app allows you, with a little effort from the highly trained neural net that is your brain, to discover these entries and immediately apply them to your puzzle!

First, notice that the Block Quarry interface is broken into two major panels.

The left panel is the Explored Panel. Here resides the app's canonical word list.

The right panel is the Frontier Panel. Here resides raw data gathered from various sources. Much of this data is frankly useless, but it does contain diamonds in the rough. See the Data Sources section below for more details. To use the Frontier Panel:
1. Load the Explored Panel with your pattern.
1. Select a data source from the dropdown on the Frontier Panel and click Load. Some result sets will span multiple pages.
<image>
1. When you discover a good entry, click it to select it and then press the `S` key to add it to the Explored Panel, where it can be exported.
<image>

You can and should do further scoring of entries as detailed in the next section.

## Entry Scoring
Entries are scored on two dimensions, as the traditional single 1-100 score doesn't seem sufficient. Scores are still converted back to a 1-100 format when exporting .dict files.

**Quality Score** runs from 1-5. The average quality score of an entry is indicated by its background color, where more green is good and more red is bad.
  


## Data Sources

The Explored Panel data comes from:
- [Mark Diehl's trimmed version of the Peter Broda word list](https://www.facebook.com/groups/1515117638602016/permalink/2997721820341583)
- Entries from a body of puzzles from indie constructor blogs, which are consistently high quality
- All the new discoveries that users have made

The Frontier data comes from various data sources:

**Newspapers**: A large list of entries gleaned from [Crossword Tracker](https://crosswordtracker.com). This includes every entry ever published in major newspaper puzzles (except for maybe *very* recent ones). There is lots of high quality stuff still to grab here as well as a bunch of iffy stuff and theme answers that you would never use.

**[Spread The Word List](https://www.spreadthewordlist.com)**: A free word list maintained by Brooke Husic. It is also heavily based on newspaper entries, but also contains a number of goodies from Brooke, which are always delightful.
  
**[OneLook](https://www.onelook.com/)**: This is *the* go-to spot for most constructors when they need new entries. It aggregates a large number of online dictionary sites into one place in a searchable manner.

The next three sources are the result of processing large corpuses of raw text to extract potential multiple word phrases. The algorithm is not fancy: groups of words that appear together often are assumed to be a potential phrase. This results in a large number of non-phrases and a small number of real phrases. Yet, among these real phrases lurks magic, and I encourage you to try your luck!

**[Nutrimatic](https://nutrimatic.org/)** uses the full text dump of Wikipedia. Names, places, historical stuff, and whatever stuff Wikipedia writers like to use can be discovered here.

**Podcasts** is derived from a [huge dataset of podcast transcripts](https://podcastsdataset.byspotify.com/). Podcasts are a great entry source because they contain the stuff that people actually talk about, which is exactly what we want in our puzzles. Probably my favorite data source.

**Ginsberg clues** uses the excellent [Matt Ginsberg clue database](http://tiwwdty.com/clue/). Both the entries and the clues themselves are indexed. Constructors turn up their creativity when writing clues, and the results often make for great entries!

More data sources will likely be added in the future. Here are some of my ideas, but let me know your ideas as well!
- Twitter trends/Current events/news sites/reddit scraper to try to capture the *really* fresh stuff
- The [Collaborative Word List](https://github.com/Crossword-Nexus/collaborative-word-list)
- Your personal word list? If you're willing to donate, that would be awesome. I also want to create a method to load up your word list locally into the Frontier Panel so you can contribute a few entries without forfeiting all your data.

## Full Word List
To gain access to the full Explored word list in .dict or .csv format, email me at ben4808@gmail.com. Please also consider a (completely optional) small donation to help with server and development costs.

## Contact
Please don't hesitate to contact me at ben4808@gmail.com with any questions, comments, feedback, or contributions! Also feel free to leave issues in this repo.
