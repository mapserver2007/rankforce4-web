# -*- coding: utf-8 -*-
require 'models/mongo_client'

module RankForce
  DEFAULT_LIMIT = 50
  DEFAULT_SORT_ORDER = -1 # descending
  DEFAULT_SORT_ITEM  = 'date.created_at'

  def sanitize(params)
    params[:limit]       ||= DEFAULT_LIMIT
    params[:sort_order]  ||= DEFAULT_SORT_ORDER
    params[:sort_item]   ||= DEFAULT_SORT_ITEM
  end

  def get_json
    sanitize(params)
    client = MongoClient.new("database.mongo.yml")
    client.sort(params[:sort_item], params[:sort_order]).get
  end

  def get_json_by_board(params = {})
    sanitize(params)
    client = MongoClient.new("database.mongo.yml")
    client.sort(params[:sort_item], params[:sort_order])
          .limit(params[:limit])
          .board(params[:board])
          .get
  end
end