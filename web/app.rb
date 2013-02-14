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
  @boards = board_map.to_json
  haml :index
end

get '/rest/all' do
  json get_json(
    :limit      => params['limit'],
    :sort_item  => params['sort_item'],
    :sort_order => params['sort_order']
  )
end

get '/rest/:board' do
  json get_json_by_board(
    :board      => params['board'],
    :limit      => params['limit'],
    :sort_item  => params['sort_item'],
    :sort_order => params['sort_order']
  )
end

get '/rest/ja/:board' do
  json :board_ja => (board_to_ja(params['board']) || "全ての板")
end
