# -*- coding: utf-8 -*-
require 'sys/proctable'
require 'yaml'

config_files = [
  YAML.load_file(File.dirname(__FILE__) + "/config/database.mongo.yml")
]

config = {}
config_files.each do |file|
  file.each {|key, value| config[key] = value}
end

task:default => [:github_push, :heroku_deploy]

task :github_push do
  sh 'git push origin master'
end

task :heroku_deploy => [:github_push] do
  sh 'git push heroku master'
end

task :heroku_env => [:heroku_env_clean, :timezone] do
  config.each do |key, value|
    sh "heroku config:add #{key}=#{value}"
  end
end

task :heroku_env_clean do
  config.each do |key, value|
    sh "heroku config:remove #{key}"
  end
end

task :heroku_create do
  sh "heroku create --stack cedar rankforce4-web"
end

task :timezone do
  sh "heroku config:add TZ=Asia/Tokyo"
end

task :heroku_start do
  sh "heroku scale web=1"
end

task :heroku_stop do
  sh "heroku scale web=0"
end

task :mongo_start do
  sh "sudo mongod --dbpath /Users/stay/mongodb --logpath /var/log/mongodb.log &"
end

task :mongo_stop do
  Sys::ProcTable.ps.each do |ps|
    if ps.comm == 'mongod'
      # SIGINT(2)
      sh "sudo kill -2 #{ps.pid}"
    end
  end
end
