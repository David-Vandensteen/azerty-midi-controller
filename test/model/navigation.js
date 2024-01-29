import { NavigationModel } from '#src/model/navigation';

const { log } = console;

let navigationObject;

navigationObject = {
  next: 'd',
  previous: 'q',
};

log(NavigationModel.deserialize(navigationObject));

navigationObject = {
  next: 'a',
  previous: 'z',
  scenes: [
    {
      id: 'track1',
      sequence: 'x',
    },
  ],
};

log(NavigationModel.deserialize(navigationObject));
