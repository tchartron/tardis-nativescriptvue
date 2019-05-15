# Timeinator

> NativeScript-Vue Time tracking application

## TODO list
 - [ ] Already Running Timer initialization
 - [ ] Register User form
 - [ ] Password recovery
 - [ ] About page/alert displays informations on api and developpers
 - [ ] Refactor CSS to scope only the component specific CSS and do not repeat yourself
 - [ ] Clean and refactor code (delete debug outputs, optimize, don't do unnecessary things)
 - [ ] Loader and disable buttons on api call processing on all components
 - [X] Display timers on task component
 - [ ] Display informations in the about section of sideDrawer
 - [ ] Add an option to auto watch filesystem : When adding a task specify a path to watch and use https://nodejs.org/docs/latest/api/fs.html#fs_event_change or https://www.npmjs.com/package/node-watch to auto start timer, then stop timer after 30 seconds of inactivity when activity again start another timer
 - [ ] Inspire of this masonry view to display tasks https://pendulums.io/img/features/projects.png one color = one company
 - [ ] Add a task owner (creator)
 - [ ] Add task store|update / groups (company) store|update
 - [ ] Inspire with : https://pendulums.io/img/features/projects.png to remake the groups view and the task view with masonry style

### Gitlab integration (as an additional issues (tasks) provider additionaly to timeinator data)
 - [ ] Gitlab API implementation
 - [ ] Companies becomes groups (gitlab groups)
 - [ ] Gitlab account login (OAuth / Laravel Passport)
 - [ ] Populate timeinator database with gitlab issues and groups (findOrCreate())
 - [ ] Show assignee on a task (issue)

