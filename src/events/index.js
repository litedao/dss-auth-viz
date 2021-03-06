const note = require('./note');
const dsAuth = require('./dsAuth');
const dsGuard = require('./dsGuard');
const { signatures } = require('./shared');

// ------------------------------------------------------------

// returns a sorted list of all relevant events
module.exports.events = async graph => {
  let events = [];

  events = events.concat(await rely(graph));
  events = events.concat(await deny(graph));
  events = events.concat(await logSetOwner(graph));
  events = events.concat(await logSetAuthority(graph));
  events = events.concat(await logPermit(graph));
  events = events.concat(await logForbid(graph));

  return sort(events);
};

// ------------------------------------------------------------

const sort = events => {
  return events.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) {
      return a.logIndex - b.logIndex;
    }
    return a.blockNumber - b.blockNumber;
  });
};

// ------------------------------------------------------------

const rely = async graph => {
  return await note(graph, signatures.rely);
};

const deny = async graph => {
  return await note(graph, signatures.deny);
};

const logSetOwner = async graph => {
  return await dsAuth(graph, 'LogSetOwner');
};

const logSetAuthority = async graph => {
  return await dsAuth(graph, 'LogSetAuthority');
};

const logPermit = async graph => {
  return await dsGuard(graph, 'LogPermit');
};

const logForbid = async graph => {
  return await dsGuard(graph, 'LogForbid');
};

// ------------------------------------------------------------
