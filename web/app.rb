# -*- coding: utf-8 -*-
$: << File.dirname(__FILE__) + "/"

require 'sinatra'
require 'sinatra/json'
require 'haml'
require 'json'
require 'models/resolver'

set :public_folder, File.dirname(__FILE__) + '/views'
set :haml, {:format => :html5}
include RankForce

get '/style.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :style
end

get '/' do
  haml :index
end

get '/:board' do
  @data = {
    :board => params['board'],
    :board_ja => board_to_ja(params['board']),
    :limit => params['limit']
  }.to_json
  haml :index
end

# 全てのデータを返す
# スレ作成日の降順ソート
get '/rest/all' do
  json get_json(
    :limit      => params['limit'],
    :sort_item  => params['sort_item'],
    :sort_order => params['sort_order']
  )
end

# 板単位のデータを返す
# スレ作成日の降順ソート
get '/rest/:board' do
  json get_json_by_board(
    :board      => params['board'],
    :limit      => params['limit'],
    :sort_item  => params['sort_item'],
    :sort_order => params['sort_order']
  )
end
