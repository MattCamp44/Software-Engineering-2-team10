TEMPLATE FOR RETROSPECTIVE (Team10)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done
- Total points committed vs done 
- Nr of hours planned vs spent (as a team)

| #              | Committed | Done       |
|:--------------:|:---------:|:----------:|
|**Stories**     |     3     |   3       | 
|**Story Points**|     11    |    11      | 
|**Hours**       |     15h   |    15h     | 

<br>

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story - Horizontal Task  | # Tasks | Points | Hours est. | Hours actual |
|:--------: |:--------:|:--------:|:--------:|:--------:|
| _Issues management_  |2        |    -      |  6h       | 4h      |
| _#0_      | 2        |    -     |   9h     | 12h       |
| _#17_     | 3        |    3     |   5h     | 4h        |
| _#18_     | 3        |    5     |   4h     | 4h        |
| _#19_     | 3        |    3     |   6h     | 4h        |
| _Testing_ | 6        |    -     |   34h    | 41h       |
| _Docker Configuration_ | 1      |    -     |   2 h     | 2h   |

   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)

|                  | Average| Standard Deviation |
|:--------:        |:------:|:--------:          |
|**Hours per task**| 3h 26m  |    4h 51m          |
<br>

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  
||Error rate||
|:-:|:--------:|:-:|
||0.98||

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 12h
  - Total hours spent: 13h
  - Nr of automated unit test cases: 93
  - Coverage (overall): 69%
<br>

- E2E testing:
  - Total hours estimated: 14h
  - Total hours spent 16h
- Code review 
  - Total hours estimated: 12h
  - Total hours spent: 13h
- Technical Debt management
  - Total hours estimated: 1h 30m
  - Total hours spent: 2h 30m
  - Hours estimated for remediation by SonarQube: 1h
  - Hours spent on remediation: 30m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  
| Reliability: | Bugs| Rating |Reemediation Effort|
|:------------:|:---:|:------:|:-------:     |
|              | 0   | A      |       0min      |

| Security | Vulnerabilities| $$Rating |Reemediation Effort|
|:------------:|:---:|:------:|:-------:     |
|              | 0   | A      |       0      |

| Maintainability | Code Smells | Debt | Debt Ratio | Rating | Effort to reach A 
|:------------:|:---:|:------:|:-------:|:-------:|:-------:|
|              | 5  | 30min |   0.0%   |     A   | 29min|


## ASSESSMENT

- What caused your errors in estimation (if any)? <br>
  The activities for which we have spent more time than estimated are those related to Unit and E2E tests since we decided to get a better coverage for the last sprint. 
- What lessons did you learn (both positive and negative) in this sprint?<br>
  We managed to work even better together thanks to the strong relationship we have developed. So we have learned that a well oiled team works better and in a more coordinate way. 

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We have delivered more tests as we desired. 
  
- Which ones you were not able to achieve? Why?
  - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.) 
  - None

> Propose one or two

- One thing you are proud of as a Team!!
  - We were able to finish all the proposed stories
  - We have done more Unit and E2E tests, so we get an higher coverage for them
  - We have found a good connection as team 