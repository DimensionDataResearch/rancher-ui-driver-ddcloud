define('ui/components/machine/driver-ddcloud/component', ['exports', 'ember', 'ui/mixins/driver'], function (exports, _ember, _uiMixinsDriver) {
  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
    driverName: 'ddcloud',

    // TODO: Use drop-down lists for "mcpRegion", "networkdomain", and "vlan".

    bootstrap: function() {
      let config = this.get('store').createRecord({
        type                     : 'ddcloudConfig',
        memory                   : 8,
        cpuCount                 : 2,
        mcpUser                  : "",
        mcpPassword              : "",
        mcpRegion                : "AU",
        networkdomain            : "Rancher",
        datacenter               : "AU10",
        vlan                     : "Rancher Primary",
        imageName                : "Ubuntu 14.04 2 CPU",
        sshUser                  : "root",
        sshKey                   : "",
        sshPort                  : 22,
        sshBootstrapPassword     : "5n4u54g3s!!!",
        usePrivateIp             : true,
        createSshFirewallRule    : true,
        createDockerFirewallRule : true,
        clientPublicIp           : ""
      });

      let type = 'host';

      if (!this.get('useHost')) {
        type = 'machine';
      }

      this.set('model', this.get('store').createRecord({
        type: type,
        'ddcloudConfig': config,
      }));
    },

    // Add custom validation beyond what can be done from the config API schema
    validate() {
      // Get generic API validation errors
      this._super();
      var errors = this.get('errors')||[];

      // Validate model.
      if (!this.get('model.ddcloudConfig.mcpUser'))
        errors.push('Must specify MCP user name.');

      if (!this.get('model.ddcloudConfig.mcpPassword'))
        errors.push('Must specify MCP password.');

      if (!this.get('model.ddcloudConfig.mcpRegion'))
        errors.push('Must specify target MCP region.');

      if (!this.get('model.ddcloudConfig.datacenter'))
        errors.push('Must specify target datacenter.');

      if (!this.get('model.ddcloudConfig.networkdomain'))
        errors.push('Must specify target network domain.');

      if (!this.get('model.ddcloudConfig.vlan'))
        errors.push('Must specify target VLAN.');

      if (!this.get('model.ddcloudConfig.imageName'))
        errors.push('Must specify target image name.');

      if (!this.get('model.ddcloudConfig.sshUser'))
        errors.push('Must specify target SSH user name.');

      if (!this.get('model.ddcloudConfig.sshBootstrapPassword'))
        errors.push('Must specify an initial password to install the SSH key.');

      if (!this.get('model.ddcloudConfig.clientPublicIp') && !this.get('model.ddcloudConfig.usePrivateIp'))
        errors.push('Client public IP must be specified when not using private IP addressing.');

      if (parseInt(this.get('model.ddcloudConfig.cpuCount'), 10) < 1)
        errors.push('CPU count cannot be less than 1');

      if (parseInt(this.get('model.ddcloudConfig.memory'), 10) < 1)
        errors.push('Memory cannot be less than 1GB');

      // Set the array of errors for display, and return true if saving should continue.
      if (errors.get('length'))
      {
        this.set('errors', errors);

        return false;
      }
      else
      {
        this.set('errors', null);

        return true;
      }
    },

    // Any computed properties or custom logic can go here
  });
});
