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
    
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (
                (structure.hits < structure.hitsMax && structure.hits < 5001) ||
                structure.hits < 1000 && structure.structureType == STRUCTURE_CONTAINER
            )
        });
        
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        else if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }
    
    if(tower) {
    }

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
    
    console.log('Current CPU usage: ' + Game.cpu.getUsed());

    if(Game.time % 10 == 0) {
        console.log('Harvesters: ' + harvesters.length);
        console.log('Upgraders: ' + upgraders.length);
        console.log('Builders: ' + builders.length);
        console.log('Repairers: ' + repairers.length);
        console.log('Haulers: ' + haulers.length)
    }
    
    if(harvesters.length < 1) {
        var newName = 'Harvester' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new harvester: ' + newName);
        }
        console.log('Harvester -- ' + 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}})
        );
    }
    else if(haulers.length < 1) {
        var newName = 'Hauler' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new hauler: ' + newName);
        }
        console.log('Hauler -- ' + 
            Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'hauler'}})
        );
    }
    else if(haulers.length < 2) {
        var newName = 'Hauler' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new hauler: ' + newName);
        }
        console.log('Hauler -- ' + 
            Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'hauler'}})
        );
    }
    else if(harvesters.length < 3) {
        var newName = 'Harvester' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new harvester: ' + newName);
        }
        console.log('Harvester -- ' + 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE], newName, 
                {memory: {role: 'harvester'}})
        );
    }
    else if(haulers.length < 4) {
        var newName = 'Hauler' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new storage hauler: ' + newName);
        }
        console.log('Hauler -- ' + 
            Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'hauler', skill: 'storage'}})
        );
    }
    else if(repairers.length < 0) {
        var newName = 'Repairer' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new repairer: ' + newName);
        }
        console.log( 'Repairer -- ' + 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'repairer'}})
        );
    }
    else if(upgraders.length < 1) {
        var newName = 'Upgrader' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new upgrader: ' + newName);
        }
        console.log('Upgrader -- ' + 
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}})
        );
    }
    else if(builders.length < 0) {
        var newName = 'Builder' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new builder: ' + newName);
        }
        console.log('Builder -- ' + 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}})
        );
    }
    else if(upgraders.length < 10) {
        var newName = 'Upgrader' + Game.time;
        if(Game.time % 20 == 0) {
            console.log('Spawning new upgrader: ' + newName);
        };
        console.log('Upgrader -- ' + 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}})
        );
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

        if (creep.pos.getRangeTo(Game.spawns['Spawn1']) == 1 && Game.creeps.length > 13) { 
            Game.spawns['Spawn1'].renewCreep(creep);
        }

        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        // roleBuilder.run(creep);
    }
};