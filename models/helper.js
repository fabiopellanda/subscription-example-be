
const findOne = async params => {
  const { Model, args } = params;
  if ('id' in args) {
    args._id = args.id;
    delete args.id;
  }
  const entity = await Model.findOne(args);
  return entity;
};

const find = async params => {
  const { Model, args, castObject = false } = params;
  const { limit, skip, sort, extraFilter } = args;

  if ('id' in args) {
    args._id = args.id;
    delete args.id;
  }

  if ('limit' in args) delete args.limit;
  if ('skip' in args) delete args.skip;
  if ('sort' in args) delete args.sort;
  if ('extraFilter' in args) delete args.extraFilter;

  const properties = Object.keys(args);

  const filters = properties.filter(x => x !== '_id' && x.includes('_'));

  filters.forEach(filter => {
    const arg = filter.split('_');
    const property = arg[0];
    const type = arg[1];
    args[property] = { [`$${type}`]: args[filter] };
    delete args[filter];
  });
  let flts = args;
  if (extraFilter) {
    flts = [...extraFilter];
    if (args) {
      Object.keys(args).forEach(key => {
        const el = {}; el[key] = args[key]; flts.push(el);
      });
      flts = { $and: [...flts] };
    }
  }
  let entities = await Model.find(flts)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  if (castObject) {
    entities = entities.map(x => x.toObject());
  }

  return entities;
};

const create = async params => {
  const { Model, args, extraData } = params;
  let entity = new Model();
  const properties = Object.entries(args);

  properties.forEach(entry => {
    const [key, value] = entry;
    entity[key] = value;
  });

  if (extraData) {
    entity = extraData(entity);
  }

  await entity.save();
  return entity;
};

const remove = async params => {
  const { Model, args } = params;
  const entity = await findOne({ Model, args });
  entity.remove();
};

const update = async params => {
  const { Model, args, extraData } = params;
  const { id, findArgs = {} } = args;
  let entity = await findOne({ Model, args: { ...findArgs, id } });
  if (!entity) throw Error('ENTITY_NOT_FOUND');
  let properties;
  properties = { ...args };
  delete properties.token;
  delete properties.id;
  delete properties.findArgs;
  properties = Object.entries(properties);

  properties.forEach(entry => {
    const [key, value] = entry;
    entity[key] = value;
  });

  if (extraData) {
    entity = await extraData(entity);
  }

  await entity.save();
  return entity;
};

module.exports.findOne = findOne;
module.exports.find = find;
module.exports.create = create;
module.exports.remove = remove;
module.exports.update = update;