var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHauler = require('role.hauler');

module.exports.loop = function () {

    var hostiles = Game.rooms['E45N49'].find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        Game.rooms['E45N49'].controller.activateSafeMode();
    }

    var tower = Game.getObjectById('685f42f9d9ec222e6c3f9ee1');
    
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }
    // }
    
    // if(tower) {
    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    
    if(Game.time % 10 == 0) {
        console.log('Current CPU usage: ' + Game.cpu.getUsed());
        console.log('Harvesters: ' + harvesters.length);
        console.log('Upgraders: ' + upgraders.length);
        console.log('Builders: ' + builders.length);
        console.log('Repairers: ' + repairers.length);
        console.log('Haulers: ' + haulers.length)
    }
    
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new harvester: ' + newName);
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    if(harvesters.length < 3) {
        var newName = 'Harvester' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new harvester: ' + newName);
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    if(haulers.length < 2) {
        var newName = 'Hauler' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new hauler: ' + newName);
        }
        Game.spawns['Spawn1'].spawnCreep([CARRY,MOVE], newName, 
            {memory: {role: 'hauler'}});
    }
    if(haulers.length < 4) {
        var newName = 'Hauler' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new hauler: ' + newName);
        }
        Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'hauler'}});
    }
    if(repairers.length < 0) {
        var newName = 'Repairer' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new repairer: ' + newName);
        }
        console.log(Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'repairer'}}));
    }
    if(upgraders.length < 3) {
        var newName = 'Upgrader' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new upgrader: ' + newName);
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
        if(upgraders.length < 1) {
        var newName = 'Upgrader' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new upgrader: ' + newName);
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
    if(builders.length < 4) {
        var newName = 'Builder' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new builder: ' + newName);
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'builder'}});
    };

    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if(creep.memory.role == 'repairer') {
        //     roleRepairer.run(creep);
        // }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        // roleBuilder.run(creep);
    }
};