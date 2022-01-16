# Block Quarry

**Link to app**: http://blockquarry.net

Block Quarry is a free crowdsourced word list augmentation tool. It is used during construction to find extra entries not yet in your word list to fill the specific slot(s) you are trying to fill.

## Quick Start

1. Enter the slot you are trying to fill into the search bar, using `.` to indicate open squares. Hit Enter. The left panel will populate will all the entries in our database that fit your slot.
<image>
1. Hit the Export button, and a new tab will be populated with these entries in .dict format. Copy/paste this onto the top of your current .dict file and reload your construction software.
<image>
1. Find more lively fill for your puzzle!

## Discovering Brand New Entries

There are multitudes of fresh and lively entries out in the world that have never appeared in a published crossword or even a constructor's word list. This is especially true for entries longer than 7 or 8 letters. This app allows you, with a little effort from the highly trained neural net that is your brain, to discover these entries and immediately slot them into the puzzle you need to fill right now!

The Block Quarry interface is broken into two major panels.

The left panel is the Explored Panel. Here resides the app's canonical word list. 

The right panel is the Frontier Panel. Here resides raw data gathered from various sources, much of which is frankly useless, but which does contain the diamonds in the rough that we are looking for. See the Data Sources section below for more details. To use the Frontier Panel:
1. First enter your slot and load the Explored Panel.
1. Select a data source from the dropdown and click Load. Some results span multiple pages, which you can move through one at a time.
<image>
1. When you find a good entry, click it to select it and then press the `S` key to add it to the Explored panel where it can be exported.
<image>

Note that you can and should do further scoring of entries as detailed in the next section.

## Entry Scoring
Entries are scored on two dimensions, as the traditional single 1-100 score doesn't seem sufficient.

**Quality Score**: 

## Data Sources

The Explored Panel data comes from:
- [Mark Diehl's trimmed version of the Peter Broda word list](https://www.facebook.com/groups/1515117638602016/permalink/2997721820341583) 
- Entries from a body of puzzles from indie constructor blogs, which are consistently high quality. 
- All the new discoveries that users have made.

The Frontier data comes from various data sources:

**Newspapers**: A large list of entries gleaned from https://crosswordtracker.com/. This includes every entry ever published in major newspaper puzzles. There is lots of high quality stuff still to grab here but also lots of iffy stuff and theme answers that you would never use.
**Spread The Word List**: A free word list maintained by Brooke Husic at https://www.spreadthewordlist.com/. This word list is also heavily based on newspaper entries, but also contains a number of goodies added by Brooke which are always delightful.
**OneLook**: [OneLook](https://www.onelook.com/) is *the* goto spot for most constructors when they need to discover new entries. It aggregates a large number of online dictionary sites into one place in a searchable manner.

The next three sources are the result of processing large corpuses of raw text to extract potential multiple word phrases. The algorithm is not fancy: groups of words that appear together often are assumed to be a potential phrase. This results in a large number of non-phrases and a small number of real phrases. Yet, among these real phrases lurks magic, and I encourage you to try your luck!

**Nutrimatic** [Nutrimatic](https://nutrimatic.org/) uses the full text dump of Wikipedia. Names, places, historical stuff, and whatever phrases Wikipedia writer like to use can be discovered here.
**Podcasts** This is derived from a [huge dataset of podcast transcripts](https://podcastsdataset.byspotify.com/). Podcasts are a great entry source because they contain the stuff that people actually talk about, which is exactly what we want in our puzzles. Probably my favorite data source.
**Ginsberg clues** This uses the excellent [Ginsberg clue database](http://tiwwdty.com/clue/). Both the entries and the clues themselves are indexed. Constructors turn up their creativity when writing clues, and the results often make great entries!

More data sources will likely be added in the future. Here are some of my ideas, but let me know your ideas as well!
- Twitter trends/Current events/news sites/reddit scraper to try to capture the *really* fresh stuff.
- The [Collaborative Word List](https://github.com/Crossword-Nexus/collaborative-word-list)
- Your personal word list? If you're willing to donate, that would be awesome. I also want to make a way to upload your word list locally so you can contribute a few words without giving up all your data.

## Full Word List
Access to the full Explored word list .dict can be had by emailing me at ben4808@gmail.com. Please also consider small donation (completely optional) to help with server and development costs.

## Contact
You can contact me at ben4808@gmail.com or by submitting an issue to this repo. Please don't hesitate to contact me with any questions, comments, feedback, or contributions!
