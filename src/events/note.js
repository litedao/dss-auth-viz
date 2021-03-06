const {
  signatures,
  message,
  getRawLogs,
  validateLists,
  bytesToAddress
} = require('./shared');

// ------------------------------------------------------------

const include = [
  'vat',
  'pit',
  'drip',
  'cat',
  'vow',
  'flap',
  'flop',
  'gov',
  'mom',
  'dai',
  'daiJoin',
  'pipDgx',
  'joinDgx',
  'flipDgx',
  'pipEth',
  'joinEth',
  'flipEth',
  'Rep',
  'pipRep',
  'joinRep',
  'flipRep'
];

const ignore = [
  'vatFab',
  'pitFab',
  'dripFab',
  'vowFab',
  'catFab',
  'tokenFab',
  'guardFab',
  'daiJoinFab',
  'daiMoveFab',
  'flapFab',
  'flopFab',
  'flipFab',
  'spotFab',
  'proxyFab',
  'null',
  'root',
  'dsRoles',
  'deploy',
  'daiMove',
  'moveDgx',
  'moveEth',
  'moveRep',
  'spotDgx',
  'spotEth',
  'spotRep',
  'daiGuard'
];

// ------------------------------------------------------------

module.exports = async (graph, sig) => {
  validateLists(graph, ignore, include);

  const events = await Promise.all(
    graph.nodes().map(async label => {
      if (ignore.includes(label)) return [];
      const contract = graph.node(label).contract;

      switch (label) {
        case 'vat':
          const vatNotes = await read(contract, sig, 'Note');
          message(vatNotes.length, type(sig), label);
          return vatNotes;

        default:
          const dsNotes = await read(contract, sig, 'LogNote');
          message(dsNotes.length, type(sig), label);
          return dsNotes;
      }
    })
  );

  return [].concat.apply([], events);
};

// ------------------------------------------------------------

async function read(contract, sig, eventName) {
  const raw = await getRawLogs(contract, { sig }, eventName);

  return raw.map(log => {
    return {
      blockNumber: log.blockNumber,
      logIndex: log.logIndex,
      src: log.address,
      guy: bytesToAddress(log.returnValues.foo),
      type: type(sig)
    };
  });
}

// ------------------------------------------------------------

const type = sig => {
  switch (sig) {
    case signatures.rely:
      return 'rely';
    case signatures.deny:
      return 'deny';
    default:
      throw new Error(`unknown event sig: ${sig}`);
  }
};

// ------------------------------------------------------------
