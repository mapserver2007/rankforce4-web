# -*- coding: utf-8 -*-
task:default => [:github_push, :heroku_deploy]

task :github_push do
  sh 'git push origin master'
end

task :heroku_deploy => [:github_push] do
  sh 'git push heroku master'
end

# task :heroku_env => [:timezone] do
#   #rankforce = YAML.load_file(File.dirname(__FILE__) + "/config/twitter.auth.yml")
#   rankforce    = YAML.load_file(File.dirname(__FILE__) + "/config/twitter.auth.test.yml")
#   evernote     = YAML.load_file(File.dirname(__FILE__) + "/config/evernote.auth.yml")
#   config = rankforce.merge(evernote)
#   config.each do |key, value|
#     sh "heroku config:add #{key}=#{value}"
#   end
# end

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