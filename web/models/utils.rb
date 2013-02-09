require 'yaml'

module RankForce
  CONFIG_ROOT = File.dirname(__FILE__) + "/../../config"

  module Utils
    def load_config(file, config_key = nil)
      file = "#{CONFIG_ROOT}/#{file}"
      obj = File.exist?(file) ? YAML.load_file(file) : ENV
      config_key.nil? ? obj : obj[config_key]
    end
  end
end