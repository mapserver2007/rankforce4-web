# -*- coding: utf-8 -*-
require 'models/mongo_client'

module RankForce
  DEFAULT_LIMIT = 50
  DEFAULT_SORT_ORDER = -1 # descending
  DEFAULT_SORT_ITEM  = 'date.created_at'
  BOARD_ROOT = File.dirname(__FILE__) + "/../../config"
  BOARD_FILE_JA = 'board.ja.txt'
  BOARD_FILE_EN = 'board.en.txt'

  def sanitize(params)
    params[:limit]       ||= DEFAULT_LIMIT
    params[:sort_order]  ||= DEFAULT_SORT_ORDER
    params[:sort_item]   ||= DEFAULT_SORT_ITEM
  end

  def get_json(params)
    sanitize(params)
    client = MongoClient.new("database.mongo.yml")
    client.sort(params[:sort_item], params[:sort_order])
          .limit(params[:limit])
          .get
  end

  def get_json_by_board(params)
    sanitize(params)
    client = MongoClient.new("database.mongo.yml")
    client.sort(params[:sort_item], params[:sort_order])
          .limit(params[:limit])
          .board(params[:board])
          .get
  end

  def board_map
    en = []
    map = {}
    File::open("#{BOARD_ROOT}/#{BOARD_FILE_EN}") do |file|
      while l = file.gets
        en << l.strip
      end
    end
    File::open("#{BOARD_ROOT}/#{BOARD_FILE_JA}") do |file|
      idx = 0
      while l = file.gets
        map[en[idx]] = l.strip
        idx += 1
      end
    end
    map[:all] = "全ての板"
    map
  end
end